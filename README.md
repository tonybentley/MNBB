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

### Raspberry Pi Device requirements

1.  A Raspberry Pi computer
2.  Temporarily you will need a HDMI enabled monotor, a usb mouse, a usb keyboard and an ethernet cable connected to the internet
3.  A micro-usb power supply which can connect to your 12 volt battery bank in some manner
4.  An SD card with at least 5 gigabytes of storage.
5.  a wifi usb dongle OR a 12 volt router with an ethernet cable plugged into one of the ports
6.  A wifi USB dongle or ethernet cable connected to the NEMA client. I am currently using the Vesber XB unit which is connected to a Dlink DIR-655 network router via wifi. The network router will also connect to the internet (when available) and to a laptop for development purposes.

## Steps to get up and running:

Since this is a WIP I will provide some instructions on how to get the NMEA data streaming on the console. I'm currently working on the datastore part, which you're welcome to hack around with. Otherwise this only connects to the TCP client and parses sentences that have valid parsers available. 

1.	Boot your Pi and connect it to the network. Check your router to make sure it has been assigned an IP for ssh purposes.
2.  Install Node.js and NPM onto the Pi using ssh from your laptop's terminal. More instructions to follow.
3.  Clone this repo to your login directory of the Pi. This should be /home/pi/.
4.  Run 'mkdir node_modules'
	Clone the forked repo into node_modules for NMEA parsing at https://github.com/tonybentley/node-nmea
5.  Add nmea credentials to config.sample.json and save as config.json
6.  Run the command: 'nodejs app.js' in the MNBB directory

At this point you should see the parsed sentences in json format, all others in the raw NMEA sentence format.

**Contributors:**
 Have a look at the issues page to determine what you can do to contribute at: https://github.com/tonybentley/MNBB/issues
 Fork this repo and use pull requests as usual
 Make suggestions for enhancements. Remember, big ideas are too much at this point so keep them simple and acheivable with easy acceptance criteria.

