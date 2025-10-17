# FocusBoard

A productivity dashboard application for managing todos, events, and notes all in one place.

## Features

- **User Authentication**: Secure login and signup system
- **Todo Management**: Create, edit, and organize tasks with priority levels and due dates
- **Event Calendar**: Schedule and manage events with location and time details
- **Note Taking**: Create and organize notes with search functionality
- **Theme Switching**: Toggle between light and dark modes with persistent preferences
- **Responsive Design**: Works on desktop and mobile devices

## Folder Structure

```
focusboard/
├── index.html          # Landing page
├── login.html          # Authentication page
├── dashboard.html      # Main dashboard
├── todos.html          # Todo management
├── events.html         # Event calendar
├── notes.html          # Note taking
├── css/
│   ├── style.css       # Main styles
│   └── components.css  # Component styles
├── js/
│   ├── app.js          # Main functionality
│   ├── auth.js         # Authentication
│   └── navigation.js   # Navigation & shortcuts
└── assets/             # Images and icons (optional)
```

## Getting Started

1. Clone or download the repository
2. Open `index.html` in your web browser
3. Sign up for a new account or log in with existing credentials
4. Start organizing your tasks, events, and notes!

## Usage

### Authentication
- Navigate to the login page to sign in or create a new account
- Your session will be maintained until you log out
- "Remember me" option for persistent login

### Dashboard
- View an overview of your todos, events, and notes
- Quick stats showing pending items
- Recent activity display

### Todos
- Add new todos with titles, descriptions, due dates, and priority levels
- Mark todos as complete
- Filter todos by status (all, pending, completed)
- Delete todos when no longer needed

### Events
- Schedule events with date, time, and location
- View upcoming events
- Delete events when no longer needed

### Notes
- Create and edit notes with rich text
- Search through your notes
- Delete notes when no longer needed

### Theme Switching
- Toggle between light and dark modes using the theme button in the top-right corner
- Your theme preference is saved automatically

## Keyboard Shortcuts

### Global Navigation
- `Ctrl+1` - Dashboard
- `Ctrl+2` - Todos
- `Ctrl+3` - Events
- `Ctrl+4` - Notes

### Page-specific Shortcuts
- **Todos Page**:
  - `+` - Add new todo
  - `A` - Show all todos
  - `P` - Show pending todos
  - `C` - Show completed todos
  - `Esc` - Cancel adding todo

- **Events Page**:
  - `+` - Add new event
  - `Esc` - Cancel adding event

- **Notes Page**:
  - `+` - Add new note
  - `Ctrl+S` - Save note
  - `Esc` - Close note editor
  - `Ctrl+F` - Focus search box

## Data Storage

All data is stored locally in your browser's localStorage:
- User authentication information
- Todos, events, and notes
- Theme preferences

## Browser Support

FocusBoard works in all modern browsers that support localStorage and modern JavaScript features:
- Chrome 50+
- Firefox 50+
- Safari 10+
- Edge 15+

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to your branch
5. Create a pull request

## License

This project is open source and available under the MIT License.

## Author

Arvind Gupta

## Acknowledgments

- Built with vanilla HTML, CSS, and JavaScript
- No external dependencies
- Responsive design using CSS Grid and Flexbox