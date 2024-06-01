# Planpro
### Organize, Invite, Meet

# Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [How PlanPro works](#how-planpro-works)
4. [Code and Organization](#code-and-organization)
6. [Additional information](#additional-information)
   
# Introduction <a name='introduction'></a>
### Plan pro is a single page application (SPA) that helps people organize meetings, socialize, and improve corporate culture as well. It is achived by easy to use inviting system and clear interface.  

# Installation <a name='installation'></a>
1. First approach
   1. Clone this repository
   2. Run setup.sh (script will open two terminal windows, download all requirements that are present requirements.txt and run python server; download all dependencies and packages that in package.json and run react app)
2. Second approach
   1. Clone this repository
   2. Open terminal and change directory to the project folder (where manage.py is located)
   3. Run `pip install -r requirements.txt`
   4. Run `python manage.py runserver`
   5. Open another terminal and change directory to frontend folder (where package.json is located)
   6. Run `npm install`
   7. Run `npm start`  

(!) Two approaches are not using venv  
If you want to use this project in venv, follow next steps:
1. Run `python -m venv [name of venv]` 
2. Change directory to it
3. Clone this repository
4. Activate venv by running `activate` file inside of Scripts folder, using `\Scripts\activate` (if you are in venv folder)
5. Change directory to this repository's folder (planpro)
6. Follow steps in first or second appoach starting from the second step

(!) Host MUST be localhost for react - http://localhost:3000 (because API requests send to http://localhost:8000/...)

# How PlanPro works  <a name='how-planpro-works'></a>
The user must log in or create account, then the user can find other users by theirs first or/and last names, send a friend request and receive a response from those users later.

When a user have at least one friend he can invite them using convinient form on map page. All selected friends will receive the event and they can either reject or accept event, if the event is accepted they will have a red-marked day on the calendar on the main page.
User can hover over it on the calendar (on PC only) to see event details and click on it to view the event on the map.
If something comes up and a user can't participate in the event anymore, he can cancel the participation.  
The requester can see which recipients have accepted the event (green check icon), who has rejected event (red X icon) and who hasn't decided yet (orange clocks icon).
If the requester decides to cancel the event, friends who have accepted it will see the event in their archive. If event's time has expired it will appear in the requester's and friends' who accepted the event archive.

Events and friend requests are delivered to users' inboxes on the mail page.
Additionally, there is an interests system that helps users display events categories they are intrested in, such as shoping, education, leisure, etc. This information can be updated on the profile page.

# Code and Organization <a name='code-and-organization'></a>
The project has following structure:  
- Root folder
    - finalproject folder
    - planpro folder
    - frontend folder
      - public folder
      - src folder
        - API folder
        - components folder
          - styles folder
          - UI
        - context folder
        - hooks folder
        - media folder
        - pages folder
          - styles folder
        - router folder
        - styles folder
        - utils folder
      - node_modules


# Additional information <a name='additional-information'></a>
If you used installation with venv approach: to deactivate venv run deactivate file in Scripts folder in venv directory
