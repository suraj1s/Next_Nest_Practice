# Modules

modules are used to specify all the nessecery resources that our app is using like controllers, services and thirdparty imports

### Imports :

Used to import child/sibling module and thirdparty services

### Controllers :

Used to import Controllers responsible for routing

### Providers :

Used to import all the services, repositories, factories, helpers, and so on. The main idea of a provider is that it can be injected as a dependency; this means objects can create various relationships with each other, and the function of "wiring up" these objects can largely be delegated to the Nest runtime system.

# Controllers

we declere services in coltrollers construcstor to avoid creating unenecassary instance of hte service class/object
the order of the routs matters
i.e all static routs must come befere dynamic routs
