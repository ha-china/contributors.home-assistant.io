---
title: 实体生命周期
description: Home Assistant 添加和移除实体时会发生什么，以及你用来订阅、清理和响应注册表（registry）变化的钩子（hook）。
sidebarLabel: Lifecycle
sidebarGroup: Basics
order: 4
source: https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/entity.py
lastVerified: 2026-10-21
---

你在集成（integration）的平台设置中创建实体（entity）对象，并通过 `async_add_entities` 把它们交给 Home Assistant。从那时起，由 Home Assistant 决定实体何时被添加、更新和移除。生命周期钩子（lifecycle hooks）让你能在这些时刻运行代码。所有这些钩子都是可选的。

## 添加实体

当你把实体传给 `async_add_entities` 时，Home Assistant 会经过以下步骤：

1. 它为实体设置其 `hass` 和 `platform` 属性。
2. 它调用 `async_prepare_to_add_to_hass()`。
3. 如果你传入了 `update_before_add=True`，它会调用更新方法。如果更新抛出异常，添加过程在此停止。
4. 如果实体具有唯一 ID（unique ID），它会在[注册表](/core/entities/registry/)中注册设备和实体，并选定实体 ID（entity ID）。如果实体已被禁用，或者其唯一 ID 或实体 ID 已被占用，添加过程在此停止。
5. 它调用 `async_added_to_hass()`。
6. 它写入第一个状态。

你的 `__init__` 在这一切之前运行，因此 `self.hass` 和 `self.entity_id` 在那里还没有被设置。让 `__init__` 只负责存储实体所需的内容，其余工作放在钩子中完成。

### `async_added_to_hass()`

The main hook. It runs as the last step of adding, right before the first state is written. The entity has its entity ID and registry entry by then. Use it to subscribe to updates, register listeners, or restore an earlier state.

The hook doesn't run when adding stops at an earlier step. But adding can still fail after the hook has started: when the hook raises, when adding is cancelled, or when writing the first state raises. `async_will_remove_from_hass` doesn't run in that case, so register the cleanup of anything you set up here with `async_on_remove`, like in the example below.

```python
async def async_added_to_hass(self) -> None:
    """Subscribe to the device once the entity is added."""
    await super().async_added_to_hass()
    self.async_on_remove(
        self._device.subscribe(self._handle_update)
    )
```

当你继承的类也可能实现该钩子时，例如 `CoordinatorEntity` 或 `RestoreEntity`，要调用 `super()`。

由于被禁用的实体永远不会被添加，如果你的集成需要保留对某个实体的引用，这个钩子也是合适的位置。你在这里注册的任何内容，只会为实际正在运行的实体注册。

The hook doesn't run again when the user changes the entity ID, except for some entities of custom integrations. See [`async_entity_id_changed`](#async_entity_id_changedold_entity_id).

### `async_prepare_to_add_to_hass()`

Runs on every attempt to add the entity, before Home Assistant looks at the registry. It also runs for entities that won't be added in the end, for example because they are disabled. Use it for work that must happen before Home Assistant processes the registry entry, or even when the entity turns out to be disabled. For example, seed entity registry options that are read when the registry entry is created or looked up, or register the entity with a helper of your integration, so an entity that is created disabled can be enabled later.

You rarely need it. Keep in mind:

- Don't rely on `entity_id` or `registry_entry` here. Depending on how the entity is added, they may be unset, set by your integration, or left over from an earlier attempt.
- Raising an exception aborts adding.
- `async_added_to_hass` may never run, and `async_will_remove_from_hass` doesn't run when adding is aborted. `async_on_remove` callbacks do run, right when adding is aborted, also when the entity is disabled. Use `async_on_remove` to clean up what only matters for this attempt to add the entity. Don't use it for a registration that has to survive a disabled entity, like in the example below: that registration belongs to your integration, so keep it there, keyed on something stable like the unique ID.
- Don't write the state, and don't subscribe to updates that write it. The entity may not have an entity ID yet, so writing the state fails. Subscribe in `async_added_to_hass` instead.

```python
async def async_prepare_to_add_to_hass(self) -> None:
    """Run before the entity is added."""
    await super().async_prepare_to_add_to_hass()
    # Let the hub know about the entity, even when it turns out to be
    # disabled, so it can be enabled later. Not undone when adding is aborted.
    self._hub.register_known_entity(self.unique_id, self._channel)
```

> [!WARNING]
> `add_to_platform_start()`, `add_to_platform_finish()`, and `add_to_platform_abort()` of `Entity` are implementation details of the entity platform. Don't override them in your integration. Use the hooks on this page instead.

## 移除实体

实体会在这几种情况下被移除：其配置条目（config entry）卸载时、用户将其禁用时，或者它被从实体注册表中删除时。停止 Home Assistant 并不会移除实体，因此这些钩子不会在关机时运行。如果必须在关机时执行某些操作，请监听 `EVENT_HOMEASSISTANT_STOP`。当实体被移除时，Home Assistant 会：

1. 调用所有通过 `async_on_remove` 注册的回调。
2. 调用 `async_will_remove_from_hass()`。
3. 移除状态。或者，当实体仍在注册表中且处于启用状态时（例如配置条目只是被卸载的情况），它会将状态设置为 `unavailable` 并带有 `restored` 属性。

### `async_on_remove(func)`

Registers a function to call when the entity is removed, or when adding it is aborted. Most subscription helpers return an unsubscribe function, so you can pass that straight in. This is the cleanest way to make sure you never leak a listener. The one exception is a subscription you replace later, for example when the entity ID changes. See [`async_entity_id_changed`](#async_entity_id_changedold_entity_id).

### `async_will_remove_from_hass()`

`async_added_to_hass` 的对应钩子。用它来撤销 `async_on_remove` 无法完成的工作，例如关闭仅属于该实体的连接。

It only runs for an entity that was added. When adding is aborted or fails, even after `async_added_to_hass` already ran, only the `async_on_remove` callbacks run. It also doesn't run when the user changes the entity ID, because the entity isn't removed, except for some entities of custom integrations. See [`async_entity_id_changed`](#async_entity_id_changedold_entity_id).

### `async_removed_from_registry()`

在实体被从实体注册表中删除时运行，而不仅仅是暂时移除。用它来清理存储在实体之外的数据，例如一个文件或设备上一个只对该实体有意义的设置。

## 注册表变化

用户可以在实体运行时在注册表中更改它：重命名它、给它换一个实体 ID、更改它的选项。

### `async_registry_entry_updated()`

在实体的注册表条目发生更改之后运行。`self.registry_entry` 中保存着新的条目。当你的实体依赖于注册表选项时使用它，例如用户选择的单位或精度。

### `async_entity_id_changed(old_entity_id)`

Runs when the user changed the entity ID. The entity is changed in place: it isn't removed and added again, so `async_will_remove_from_hass` and `async_added_to_hass` don't run. Unlike those hooks, this one is a `@callback` that runs in the event loop, so it must not await.

> [!IMPORTANT]
> Until Home Assistant 2027.11, custom integrations have to opt in to in-place changes. If a class of a custom integration implements `async_prepare_to_add_to_hass`, `async_added_to_hass`, or `async_will_remove_from_hass`, but neither that class nor a subclass of it implements `async_entity_id_changed`, its entities are still removed and added again when the entity ID changes. Then the add and remove hooks run again, and this hook doesn't run. See the [blog post about the new lifecycle hooks](/blog/2026/10/12/new-entity-lifecycle-hooks/).

By then, `self.entity_id` is the new ID, and the old ID is passed as `old_entity_id`. The state under the old ID is already removed, `async_registry_entry_updated` already ran, and Home Assistant has moved its own bookkeeping to the new ID, like registry tracking and restore state. The state under the new ID isn't written yet.

If you track something by your own entity ID, like a state change listener or a dispatcher signal keyed on `self.entity_id`, or a lookup table from entity IDs to entities, move it to the new ID here. Always call `super()`, so base classes can do the same. If your entity sets up nothing keyed on its own entity ID, you don't need this hook. A custom integration that implements the add or remove hooks still needs it to opt in to in-place changes, and then a hook that only calls `super()` is enough.

Home Assistant writes the state under the new ID when the hook returns, unless you already did. If you need your own state under the new ID, for example to render a template that references `this`, write it with `self.async_write_ha_state()` yourself, but only after calling `super()`, so base classes have updated what the state depends on.

Work that has to await can run in a task. Registry updates don't wait for that task, so after each `await`, check that the entity is still added and that `self.entity_id` didn't change again.

If the hook raises, Home Assistant logs the exception and the change completes anyway: the state is written under the new ID.

Take care that whatever you subscribe again is still cleaned up when the entity is removed. `self.async_on_remove(self._unsub_signal)` registers the unsubscribe function of the *first* subscription. After the entity ID changed, removing the entity calls that stale function again, and the new subscription leaks. Instead, register a callback once that calls the current unsubscribe function:

```python
async def async_added_to_hass(self) -> None:
    """Subscribe once the entity is added."""
    await super().async_added_to_hass()
    self._subscribe_signal()
    self.async_on_remove(lambda: self._unsub_signal())

@callback
def _subscribe_signal(self) -> None:
    """Subscribe to the signal for the current entity ID."""
    self._unsub_signal = async_dispatcher_connect(
        self.hass, f"{DOMAIN}_{self.entity_id}", self._handle_signal
    )

@callback
def async_entity_id_changed(self, old_entity_id: str) -> None:
    """Move the subscription to the new entity ID."""
    super().async_entity_id_changed(old_entity_id)
    self._unsub_signal()
    self._subscribe_signal()
```

Unsubscribing in `async_will_remove_from_hass` avoids the stale function too, but that hook doesn't run when adding fails after `async_added_to_hass` ran.

## 恢复状态

有些实体必须在重启后仍记住自己的状态，因为设备无法告诉它们。同时还要继承 `homeassistant.helpers.restore_state` 中的 `RestoreEntity`，并在 `async_added_to_hass` 中读取最后一个状态：

```python
from homeassistant.helpers.restore_state import RestoreEntity


class ExampleSwitch(SwitchEntity, RestoreEntity):
    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        if (last_state := await self.async_get_last_state()) is not None:
            self._attr_is_on = last_state.state == "on"
```

传感器（sensor）实体则使用 `RestoreSensor`，并通过 `RestoreSensor.async_get_last_sensor_data()` 读取最后一个状态，它还会恢复原生值（native value）和单位。参见[传感器实体](/core/entities/sensor/)。
