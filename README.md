# App-Ride 🚵‍♂️ -> Work in progress 🚧

HTML + CSS + JavaScript + Bootstrap app that will track all the route on a bike race

- It can be used for another purposes, like tracking snowboarding, racing, mountain bike etc...

---

| Functionality                        | Is Done ? |
| ------------------------------------ | --------- |
| `Get current GEOLocation`            | Yes       |
| `Get current speed`                  | Yes       |
| `Save the location and speed`        | Yes       |
| `Show a list with all registers`     | Yes       |
| `Calculate totalDistance`            | Yes       |
| `Calculate Max and Min speed`        | No        |
| `Calculate the duration`             | Yes       |
| `Show the complete path on the map ` | Yes       |

| Screens                       | Is Done ? |
| ----------------------------- | --------- |
| `Home Screen`                 | Yes       |
| `Speedometer Screen`          | Yes       |
| `Details Screen`              | Yes       |
| `Statistics Screen after run` | No        |

---

## How to run the application

To run at your Browser use the [WebApp](#webapp) section, if you want to build on mobile use [Mobile](#mobileapp)

#### WebApp

> Right mouse click at index.html -> Open With -> Your Browser

#### MobileApp

Well, its a web application in fact, so to run at mobile device need to do something on you PC frist.

> Prerequisites

1. Download [Vscode](https://code.visualstudio.com/)
2. Install [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
3. Install [NgRok](https://ngrok.com/), you need to creat an account and make the configurations, all documentation is available on the website.

> How to run

1. Clone the project using > `git clone https://github.com/fefranco97/app-ride.git`
2. Go to the index.html file then press " CTRL+Shift+P " then write Live Server: Open with live Server
3. Open your terminal and type `ngrok http htpp://localhost:5500`
4. It will generate an URL to use, put on you phone and have fun 😎
