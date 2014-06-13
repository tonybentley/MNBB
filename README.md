# Mariners NMEA Black Box

Mariners NMEA Black Box is an open source project that introduces a concept to marine navigation that is not common on personal pleasure craft, even with modern mobile apps. The majority of applications available will enable you to connect to a NMEA network via wifi but will only show you the _current_ instrument data. There are a few devices on the market that will record your vessel instrument data and allow you to view reports or compare this information to make better decisions or watch trends with wind, temperature, tracking and recording all AIS targets within VHF range or whatever you are interested in learning. 

One of the biggest misconceptions about marine navigation devices is that consumer electronics that are not specifically designed for the "harsh marine environment" and while this may be true in some circumstances, is incorrect in regards to the devices we have come to depend on for every day use. A product has emerged into the market that has enabled computers to be low energy, compact and highly versatile. The product is called a Raspberry Pi and is essentially a fully functional computer that draws less than one amp of 12 volt power and can run various programs and provide simple applications using modern day technology. 

This project makes use of a Raspberry Pi and a wifi or wired local network that provides NMEA instrument data through the network to be captured and viewed whenever you would like. Connecting any of your electronics with a built-in web browser to the network then enables you to access the information just like you would normally by "surfing" the local internet. 

## For Mariners

MNBB is in development and does not even have a developer release at the moment. Eventually you will be able to pay someone who specializes in NMEA instrument install and repair to install this inexpensive unit for you at the market price of a Raspberry Pi, the NMEA wifi client and the installer's hourly rate. Feel free to email me with any questions. Availability may not be until 2015. In the meantime, get your NMEA wifi client installed and buy a marine navigation app for your smartphone or tablet. I suggest the combination of the VesperXB and iNavX for iPhone users. You will then be broadcasting Class B AIS with your gps position and vessel name, size, etc to other commercial vessels and receiving all classes of AIS from anyone within your VHF range. 

## For Developers

The open source project makes use of Node.js as the application platform, a MySQL database that collects the NMEA data and normalizes it into insert rows and finally a normal front-end web application that queries the database and receives JSON formatted results for the front-end to consume. The project is module based, which means you can introdue a new module into the project which will query the database with your custom results and display the data in a richly formatted UI developed with your own custom JavaScript, CSS and HTML. 

### Modules

NMEA parsing and json conversion: NMEA provides a delimited sentence that can be parsed into readable and usable json data format. As part of the module development, you can introduce your own custom sentence parser for a NMEA standard sentence. I have forked the node-nmea project at https://github.com/tonybentley/node-nmea to for nmea sentence parsing. 

**Database:** Each NMEA sentence will be inserted into the database at an interval dictated by a configuration map for each talker type. 

**Custom Queries:** As part of the web application module, a set of custom queries deliver a subset of data in JSON format that you can use for displaying in your custom user interface. This is the core of the application and the method in which data will be compared.

**Front-End Application:** This is where the entire architecture will allow non-technical mariners to use the application. Using Node's web server capabilities, a user will simply connect to the application using HTTP and navigate to the home screen to view the modules that are installed into their Raspberry Pi.

### Contributors

There are three parts needed to make this project a success. First is getting the basic NMEA sentences parsed and inserted into the database in a manner that agrees with the Raspberry Pi's capabilities. Second is developing the architecture to insert the parsed sentences into a database that works easily with a front-end application. The final part is writing queries and displaying the results as a web application. 

### Raspberry Pi Device requirements

1.  A Raspberry Pi computer
2.  Temporarily you will need a HDMI enabled monotor, a usb mouse, a usb keyboard and an ethernet cable connected to the internet
3.  A micro-usb power supply which can connect to your 12 volt battery bank in some manner
4.  An SD card with at least 5 gigabytes of storage.
5.  a wifi usb dongle OR a 12 volt router with an ethernet cable plugged into one of the ports
6.  Wifi or ethernet cable connected to the NEMA client. I am currently using the Vesber XB unit which is connected to a Dlink DIR-655 network router via wifi. The network router will also connect to the internet (when available) and your laptop for development purposes.

## Steps to get up and running:

Since this is a WIP I will provide some instructions on how to get the NMEA data streaming on the console. I'm currently working on the MySQL DB part which you're welcome to hack around with. Otherwise, this only connects to the TCP client and parses sentences that have valid parsers available. 

1.  Install Node.js and NPM onto the Pi
2.  Clone this repo to your login directory of the Pi
3.  run npm-install
4.  add nmea and mysql credentials to config.sample.json and save as config.json
5.  run the command: 'nodejs app.js' in the MNBB directory

At this point you should see the parsed sentences in json format, all others in the raw NMEA sentence format. If you would like to contribute, start with building valid NMEA parsers in the node-nmea forked repo through pull requests. 
