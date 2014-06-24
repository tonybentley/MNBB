# Mariners NMEA Black Box

Mariners NMEA Black Box is an open source project that introduces a concept to marine navigation that is not common on personal pleasure craft, even with modern mobile apps. The majority of applications available will enable you to connect to a NMEA network via wifi but will only show you the _current_ instrument data. There are a few devices on the market that will record your vessel instrument data and allow you to view reports or compare this information to make better decisions or watch trends with wind, temperature, tracking and recording all AIS targets within VHF range or whatever you are interested in learning. 

One of the biggest misconceptions about marine navigation devices is that consumer electronics that are not specifically designed for the "harsh marine environment" and while this may be true in some circumstances, is incorrect in regards to the devices we have come to depend on for every day use. A product has emerged into the market that has enabled computers to be low energy, compact and highly versatile. The product is called a Raspberry Pi and is essentially a fully functional computer that draws less than one amp of 12 volt power and can run various programs and provide simple applications using modern day technology. 

This project makes use of a Raspberry Pi and a wifi or wired local network that provides NMEA instrument data through the network to be captured and viewed whenever you would like. Connecting any of your smartphones, computers and tablets with a built-in web browser to connect your vessel's wifi network then enables you to access the information just like you would normally by going to a web browser and typing in a url. 

## For Mariners

MNBB is in development and does not even have a developer release at the moment. The goal is to be able to install this inexpensive unit at the market price of a Raspberry Pi, the NMEA wifi client and an installer's hourly rate for getting the Pi configured with the needed software, connected to the local wifi network, and wired to the 12 volt battery bank. Feel free to email me with any questions. Availability may not be until 2015. In the meantime, get your NMEA wifi client installed and buy a marine navigation app for your smartphone or tablet. I suggest the combination of the VesperXB and iNavX for iPhone users. You will then be broadcasting Class B AIS with your gps position and vessel name, size, etc to other commercial vessels and receiving all classes of AIS from anyone within your VHF range. 

## For Developers

The open source project makes use of Node.js as the application platform, a NoSQL database that collects the NMEA data and normalizes the data into objects and collections, and finally a front-end web application that queries the database and receives JSON formatted results for the front-end to consume. The project is module based, which means you can introdue a new module into the project which will make use of the database to deliver your custom query results and display the data in a richly formatted UI developed with your own custom JavaScript, CSS and HTML. 

### Modules

NMEA parsing and json conversion: NMEA provides a delimited sentence that can be parsed into readable and usable json data format. As part of the module development, you can introduce your own custom sentence parser for a NMEA standard sentence. I have forked the node-nmea project at https://github.com/tonybentley/node-nmea to for nmea sentence parsing. 

**Database:** Each NMEA sentence will be inserted into the database at an interval dictated by a configuration map for each talker type. 

**Custom Queries:** As part of the web application module, a set of custom queries deliver a subset of data in JSON format that you can use for displaying in your custom user interface. This is the core of the application and the method in which data will be compared.

**Front-End Application:** This is where the entire architecture will allow non-technical mariners to use the application. Using Node's web server capabilities, a user will simply connect to the application using HTTP and navigate to the home screen to view the modules that are installed into their Raspberry Pi.

### Contributors

There are three parts needed to make this project a success. First is getting the basic NMEA sentences parsed and inserted into the database in a manner that agrees with the Raspberry Pi's capabilities. Second is developing the architecture to insert the parsed sentences into a database that works easily with a front-end application. The final part is writing queries and displaying the results as a web application. 

### Marine Network requirements

You need a NMEA 0183 network (capturing wind, speed, etc) that is broadcast through wifi. The wifi device can be a number of different units but should send plain-text NMEA sentences over TCP. If you need assistance choosing the best one, send me a message I will assist. They run from $200-800 depending on what kind of added functionality you would like. A Brookhouse NMEA multiplexer is a solid product, as is the Vesber XB.

### Raspberry Pi Device requirements

1.  A Raspberry Pi computer
2.  Temporarily you will need a HDMI enabled monotor, a usb mouse, a usb keyboard and an ethernet cable connected to the internet
3.  A micro-usb power supply which can connect to your 12 volt battery bank in some manner
4.  An SD card with at least 5 gigabytes of storage.
5.  a wifi usb dongle OR a 12 volt router with an ethernet cable plugged into one of the router ports
6.  A wifi USB dongle or ethernet cable connected to the NEMA client. I am currently using the Vesber XB unit which is connected to a Dlink DIR-655 network router via wifi. The network router will also connect to the internet (when available) and to a laptop via wifi for development purposes.

## Steps to get up and running:

Unfortunately I'm at a stage where running the Pi with the required dependencies are in limbo. Checkout this repository and try to run the npm install. The node_nmea library must be cloned into the node_modules but otherwise the only dependencies needed are MongoDB, which is not easy to install on a Pi at the moment. Once you have Node,NPM, Mongo and the Node dependencies installed you can start logging NMEA sentences into the Mongo database. Feel free to email or submit an issue if you are unsuccessful at installing this into a Pi. I will assist in troubleshooting any issue as priority one over enhancements.


**Contributors:**
 Have a look at the issues page to determine what you can do to contribute at: https://github.com/tonybentley/MNBB/issues
 Fork this repo and use pull requests as usual. The web_modules is where all of the different applications will live. Currently I have the basic data available using Express routes. The front-end applications are incomplete.
 
Make suggestions for enhancements if you like. Remember, big ideas are too much at this point so keep them simple and acheivable with easy acceptance criteria. I'm looking for ideas on comparable data. Examples would be starting a 'trip' and getting maximum values (max speed, max wind speed, etc) over a given duration.

