# Research Paper Finder

A modern web application that helps researchers find and explore academic papers efficiently. The application provides a user-friendly interface to search through academic papers, filter results, and view detailed information including abstracts.

## Features

- **Advanced Search**: Search for research papers using keywords, titles, or authors
- **Filtering Options**: 
  - Filter by publication year (2024-2025)
  - Customize number of results (default: 10)
- **Paper Details**:
  - View paper titles and URLs
  - Toggle abstract visibility
  - Clean and intuitive interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

### Backend
- FastAPI (Python)
- BeautifulSoup4 for web scraping
- Uvicorn server

### Frontend
- React.js with TypeScript
- Material-UI components
- Axios for API communication

## Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn app:app --reload
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## API Documentation

### Search Endpoint
- **URL**: `/api/search`
- **Method**: `GET`
- **Query Parameters**:
  - `query` (string): Search term
  - `start_year` (number, optional): Start year for filtering (default: 2024)
  - `end_year` (number, optional): End year for filtering (default: 2025)
  - `max_results` (number, optional): Maximum number of results (default: 10)
- **Response**: Array of paper objects containing title, URL, and abstract

## Usage Guide

1. **Search for Papers**:
   - Enter keywords in the search bar
   - Adjust filters if needed (year range, number of results)
   - Click the search button

2. **View Results**:
   - Browse through the list of papers
   - Click "Show Abstract" to view paper abstracts
   - Click on paper titles to visit the source URL

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
