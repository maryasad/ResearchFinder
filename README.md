# Step By Step Guide Line:
## Step 1: Set Up the Development Environment
### Install Required Tools:
    Python , Node.js, Git, Docker 

### Organize the Project Directory:
    ResearchFinder/
        ├── backend/     # Backend API
        ├── frontend/    # Web frontend
        ├── mobile-app/  # Mobile app
        └── README.md    # Documentation



'''
    cd ResearchFinder
    git init
'''

## Step 2: Backend Development
### 2.1 Set Up the Backend

    - cd ResearchFinder/backend
    - python -m venv venv
    - venv/Scripts/activate  # For Windows

    - Create a requirements.txt
        fastapi
        uvicorn
        beautifulsoup4
        requests

    - pip install -r requirements.txt

### 2.2 Write Backend Code
    - Create an app.py file for your API. Start by defining the endpoints /subjects, /search, etc., using the FastAPI code

## Step 3: Run the Backend
    1. Create a New Python File (app.py or main.py)
        - python app.py
    2. Define the API Endpoints in app.py
    3. Run the FastAPI App
        - uvicorn app:app --reload
    4. Add Database Setup 


## Step 4: Frontend Website
    1. Navigate to the frontend folder:
        - cd ../frontend
    2. Initialize React.js Project: Use Create React App or Vite for simplicity:
        - npx create-react-app .
    3. Start Development Server:
        - npm start
    4. Connect Frontend to Backend: Use Axios to call the backend API and display results.  
     For example:







