# Purpose
Created for the purpose of Tracking Washing Machines to return the optimal time to go wash clothes (Definitely not for Webjam).

## Installation
First, make sure that [Node.js](https://nodejs.org/en/download/package-manager) is downloaded

Have react be downloaded:
``` bash
npm i react
```

Make sure that the directory is choosen to by my-app:
``` bash
cd my-app
```

Run the file:
``` bash
npm start
```

Have fun with Programming!

## How to Use
Film the Washing Machine (requires digital text) with another device (phones or tablets) or a the computer webcam. 
Choose coordinates for which the Washing Machine's digtal clock is located.
Check the status of the Status on the Washing Machines!!!


## Credits 

This website is create for the 2024 Webjam event at UCI hosted by [ICSSC](https://studentcouncil.ics.uci.edu/).
The main purpose of this website is to reduce wait times for doing laundries in a public setting.
We hope that this program can be utilized to simiplfy the life of others and can also be used by other industries, such as the Laundromat Industry, to increase their revenue.

Programmed by Will Bao, Cody Chen, William Chen, and Jianan Zhu.

Programmed in Javascript and Python using React as the framework.


### Algorithm End

For the algorithm part, we use python opencv2 to process the images stored and detect the content in the washing machine's panel. It will show whether the washing machine is working or not. The files are in ./flaskBackend and ./otherPython.


### Backend Server
The Flask Library in python is located in the folder flaskBackend. The main server file is server.py.

This server handles the interaction between the uploads folder and the frontend react website. 
It allows users to:
 get/upload folders
 get/upload photos 
 get/upload coordinates 
 get/upload status
 updates status every 2 seconds