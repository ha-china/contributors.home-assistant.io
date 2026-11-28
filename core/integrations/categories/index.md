# 集成分类

> 用户浏览集成时依据的分类，以及如何为你的集成选择合适的分类。

Source: https://www.hasscn.top/contributors/core/integrations/categories/

集成（integration）分类表明一个集成的用途，使人们能够根据其功能找到它，例如在网站的集成页面上。集成会在其[清单（manifest）](https://www.hasscn.top/contributors/core/integrations/manifest/#categories)的 `categories` 键中列出一到三个分类。核心（core）中的每个集成都需要分类，但实体（entity）、系统和虚拟集成除外。对于自定义集成，分类是可选的，Marketplace 目录会在其数据中收录这些分类。

## 如何选择

问自己一个问题：这是什么，人们会在哪里寻找它？分类描述的是产品或服务，而不是 Home Assistant 为其创建的实体。

1. 选择主要分类：即表明你的集成用途的分类。一个恒温器品牌应归入 Climate（气候），即使它同时也会创建传感器和开关。
2. 当某个子分类（subcategory）明显合适时使用它，例如 `climate.thermostats_heating`。否则，单独使用该分类。
3. 只有当你的集成确实也属于另一个分类，且人们会据此浏览查找时，才添加第二个或第三个分类。Shelly 生产智能插头和开关，但也生产灯泡和电能表，因此它列出了全部三个分类。

大多数集成只需要一个分类。以下是一些常见情况的指南：

- 接入多种类型设备的网关（hub）或桥接器（bridge），例如 Zigbee 或多用途厂商桥接器，应归入 Hubs & protocols（网关与协议）。仅针对某一种产品的桥接器则归入该产品的分类：Philips Hue 属于 Lighting（照明）。
- 通用构建模块，例如 MQTT、RESTful 或 Modbus，应归入 DIY & makers（DIY 与创客）。
- 辅助元素（helper）首先应归入 Helpers（辅助元素）。只有当辅助元素明显属于某个现实领域时，才添加该领域的分类，例如公用事业仪表（utility meter），它同时也属于 Energy（能源）。
- 气象站测量天气，而不是预报天气。单独使用 Weather & alerts（天气与警报），将 Forecasts（预报）留给真正提供预报的服务。

实体和系统集成，例如 `light` 或 `recorder`，并不是人们会浏览查找的对象，因此没有分类。虚拟集成同样没有分类：它们显示其所指向集成的分类。

## 所有分类

下面每个分类都列出了你可以填入 `categories` 的值。一些分类包含子分类，用于进一步细分：当你的集成覆盖该分类的多个方面时，单独使用该分类；当某个子分类合适时，使用该子分类。智能恒温器应使用 `climate.thermostats_heating`。而生产恒温器、空调和风扇的品牌则应使用 `climate`。

根据集成的用途查找分类，例如“thermostat”（恒温器）或“pool”（泳池），或者直接跳转到某个分类。

- AI & voice: AI models and agents, voice assistants, speech-to-text, text-to-speech and image recognition.
  - AI & voice, in general: `ai_voice`
  - AI models: `ai_voice.ai_models`
  - Image recognition: `ai_voice.image_recognition`
  - Speech: `ai_voice.speech`
  - Voice assistants: `ai_voice.voice_assistants`
- Appliances & cleaning: Cooking and kitchen appliances (ovens, coffee machines, sous vide, cooking thermometers, brewing), laundry, robot vacuums and mops, and fragrance diffusers.
  - Appliances & cleaning, in general: `appliances_cleaning`
  - Cleaning: `appliances_cleaning.cleaning`
  - Cooking: `appliances_cleaning.cooking`
  - Laundry: `appliances_cleaning.laundry`
- Blinds & curtains: Blinds, curtains, shutters, awnings, garage doors and gates.
  - Blinds & curtains: `blinds_curtains`
- Buttons & remotes: Smart buttons, remote controls, and infrared or radio blasters that control other devices.
  - Buttons & remotes: `buttons_remotes`
- Climate: Heating, cooling and ventilation: thermostats, heat pumps, air conditioners, fans, humidifiers, air purifiers and water heaters.
  - Climate, in general: `climate`
  - Air purifiers & humidifiers: `climate.air_purifiers_humidifiers`
  - Fans & ventilation: `climate.fans_ventilation`
  - Heat pumps & air conditioning: `climate.heat_pumps_air_conditioning`
  - Thermostats & heating: `climate.thermostats_heating`
  - Water heaters: `climate.water_heaters`
- Computers & network: Routers, NAS, servers, printers, 3D printers, cloud hosting, developer tools and uptime monitoring.
  - Computers & network, in general: `computers_network`
  - Cloud & developer tools: `computers_network.cloud_developer_tools`
  - Monitoring: `computers_network.monitoring`
  - NAS & servers: `computers_network.nas_servers`
  - Printers: `computers_network.printers`
  - Routers & network: `computers_network.routers_network`
- DIY & makers: Build your own: firmware, message brokers, and generic connectors for web APIs, databases, serial ports and Modbus.
  - DIY & makers, in general: `diy_makers`
  - Boards & hardware interfaces: `diy_makers.boards_hardware`
  - Web & data connectors: `diy_makers.web_data_connectors`
- Energy: Solar panels, home batteries, energy meters, EV chargers, generators, UPS, gas and propane tanks, and energy prices.
  - Energy, in general: `energy`
  - Backup power: `energy.backup_power`
  - Energy prices: `energy.energy_prices`
  - EV charging: `energy.ev_charging`
  - Meters & monitoring: `energy.meters_monitoring`
  - Solar & batteries: `energy.solar_batteries`
- Finance: Bank accounts, budgeting tools, stocks, currency exchange rates and cryptocurrency.
  - Finance: `finance`
- Garden & plants: Irrigation, lawn mowers, plant sensors, hydroponics and greenhouses.
  - Garden & plants: `garden_plants`
- Health & wellbeing: Scales, toothbrushes, sleep and fitness tracking, glucose monitoring and baby care.
  - Health & wellbeing: `health_wellbeing`
- Helpers: Entities you create yourself, without a device behind them: toggles, numbers, timers and schedules, and values calculated from other entities.
  - Helpers, in general: `helpers`
  - Calculate a value: `helpers.calculate_value`
  - Store a value: `helpers.store_value`
- Hubs & protocols: Smart home hubs and radio protocols that each bring in many kinds of devices.
  - Hubs & protocols, in general: `hubs_protocols`
  - Building automation: `hubs_protocols.building_automation`
  - Smart home hubs: `hubs_protocols.smart_home_hubs`
  - Wireless protocols: `hubs_protocols.wireless_protocols`
- Lighting: Smart bulbs, light strips, fixtures and lighting systems.
  - Lighting, in general: `lighting`
  - Bulbs & lamps: `lighting.bulbs_lamps`
  - LED strips & controllers: `lighting.led_strips_controllers`
  - Lighting systems: `lighting.lighting_systems`
- Local services: Waste collection, power outages, parking, fuel prices and other city or utility information.
  - Local services: `local_services`
- Media & entertainment: TVs, speakers, streaming, music services, receivers, game consoles, game servers and radio.
  - Media & entertainment, in general: `media_entertainment`
  - Gaming: `media_entertainment.gaming`
  - Music & radio services: `media_entertainment.music_radio_services`
  - Speakers & audio: `media_entertainment.speakers_audio`
  - TV & streaming: `media_entertainment.tv_streaming`
- Messaging & notifications: Send and receive messages: push notifications, email, chat apps, SMS and phone calls.
  - Messaging & notifications, in general: `messaging_notifications`
  - Chat apps: `messaging_notifications.chat_apps`
  - Email, SMS & calls: `messaging_notifications.email_sms_calls`
  - Push notifications: `messaging_notifications.push_notifications`
- News & social media: Follow news and RSS feeds, and follow or post to social networks, blogs and video channels.
  - News & social media: `news_social_media`
- Other ecosystems: Use your Home Assistant devices in Apple Home, Alexa, Google Home and other platforms.
  - Other ecosystems: `other_ecosystems`
- Pets: Feeders, litter boxes, pet doors, pet trackers and aquariums.
  - Pets: `pets`
- Plugs & switches: Smart plugs, light switches, dimmers and relays.
  - Plugs & switches: `plugs_switches`
- Presence & location: Know who is home and where devices are: phones, trackers and network presence.
  - Presence & location, in general: `presence_location`
  - Network presence: `presence_location.network_presence`
  - Phones & companion apps: `presence_location.phones_companion_apps`
  - Trackers: `presence_location.trackers`
- Productivity & information: Calendars, to-do and shopping lists, grocery delivery, package tracking, documents, photos and bookmarks.
  - Productivity & information, in general: `productivity_information`
  - Calendars & to-dos: `productivity_information.calendars_todos`
  - Documents & photos: `productivity_information.documents_photos`
  - Shopping & groceries: `productivity_information.shopping_groceries`
- Security & safety: Cameras, doorbells, locks, keypads, alarm systems, sirens, and smoke alarms.
  - Security & safety, in general: `security_safety`
  - Alarm systems: `security_safety.alarm_systems`
  - Cameras: `security_safety.cameras`
  - Doorbells & intercoms: `security_safety.doorbells_intercoms`
  - Locks & access: `security_safety.locks_access`
  - Smoke & CO alarms: `security_safety.smoke_co_alarms`
- Sensors: Motion, door and window, temperature, humidity and air quality sensors.
  - Sensors, in general: `sensors`
  - Air quality: `sensors.air_quality`
  - Door & window: `sensors.door_window`
  - Motion & presence: `sensors.motion_presence`
  - Temperature & humidity: `sensors.temperature_humidity`
- Vehicles & transport: Cars, EVs, e-bikes, public transport and flight tracking.
  - Vehicles & transport, in general: `vehicles_transport`
  - Bikes & scooters: `vehicles_transport.bikes_scooters`
  - Cars & EVs: `vehicles_transport.cars_evs`
  - Flights: `vehicles_transport.flights`
  - Public transport: `vehicles_transport.public_transport`
- Water: Water meters, leak detection, softeners and filters, tanks, pools and spas.
  - Water, in general: `water`
  - Meters & leak detection: `water.meters_leak_detection`
  - Pools & spas: `water.pools_spas`
  - Water treatment: `water.water_treatment`
- Weather & alerts: Forecasts, outdoor air quality, pollen, and public warnings for storms, floods, earthquakes or air raids.
  - Weather & alerts, in general: `weather_alerts`
  - Air quality & pollen: `weather_alerts.air_quality_pollen`
  - Forecasts: `weather_alerts.forecasts`
  - Public warnings: `weather_alerts.public_warnings`
