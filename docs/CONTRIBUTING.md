# Contributing to Smart Learning Path

Thank you for your interest in contributing to Smart Learning Path! This document provides guidelines for contributing to this project.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)
- Git
- PostgreSQL database access
- Google Gemini API key

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/smart-learning-path.git
   cd smart-learning-path
   ```
3. Follow the setup instructions in [SETUP.md](SETUP.md)

## 📋 How to Contribute

### 1. Issues
- Check existing issues before creating new ones
- Use clear, descriptive titles
- Provide detailed descriptions with steps to reproduce bugs
- Label your issues appropriately

### 2. Pull Requests
- Create a new branch for each feature/bugfix
- Use descriptive branch names (e.g., `feature/quiz-timer`, `fix/auth-bug`)
- Make small, focused commits with clear messages
- Test your changes thoroughly
- Update documentation as needed

### 3. Code Style
- Follow existing code style and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## 🏗️ Project Structure

```
smart-learning-path/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── services/       # API services
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── utils/              # Server utilities
└── docs/                   # Documentation
```

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm test
```

### Backend Testing
```bash
cd server
npm test
```

### Manual Testing
- Test all user flows (registration, login, quiz creation, etc.)
- Test on different browsers and screen sizes
- Verify API endpoints using Postman or similar tools

## 📝 Commit Message Convention

Use the following format for commit messages:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

Examples:
```
feat(quiz): add timer functionality to quizzes
fix(auth): resolve JWT token expiration issue
docs(api): update API documentation for quiz endpoints
```

## 🐛 Bug Reports

When reporting bugs, please include:
- **Environment**: OS, browser version, Node.js version
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable
- **Error messages**: Any console errors or logs

## 💡 Feature Requests

When suggesting new features:
- **Use case**: Describe the problem this feature would solve
- **Proposed solution**: Your suggested approach
- **Alternatives**: Other solutions you've considered
- **Additional context**: Any other relevant information

## 🎨 UI/UX Guidelines

### Design Principles
- **Dark theme first**: Maintain the existing dark theme aesthetic
- **Accessibility**: Ensure proper contrast ratios and keyboard navigation
- **Consistency**: Use existing color palette and component styles
- **Responsiveness**: Test on mobile, tablet, and desktop

### Color Palette
- **Primary**: #4ade80 (green)
- **Background**: #0a0a0a (dark)
- **Card background**: #1a1a1a
- **Border**: #333
- **Text**: white, #ccc, #666
- **Error**: #ef4444
- **Warning**: #fbbf24

## 🔐 Security

### Security Guidelines
- Never commit sensitive information (API keys, passwords, etc.)
- Validate all user inputs
- Use HTTPS in production
- Implement proper authentication and authorization
- Follow OWASP security guidelines

### Reporting Security Issues
For security vulnerabilities, please email the maintainers directly instead of creating public issues.

## 📚 Documentation

### When to Update Documentation
- Adding new features
- Changing existing functionality
- Fixing bugs that affect usage
- Adding new API endpoints

### Documentation Standards
- Use clear, concise language
- Provide code examples
- Include screenshots for UI changes
- Update the README.md if needed

## 🤝 Code Review Process

### For Contributors
- Ensure your code follows project conventions
- Test your changes thoroughly
- Write clear commit messages
- Respond to feedback promptly

### For Reviewers
- Be constructive and respectful
- Focus on code quality and maintainability
- Test the changes locally
- Provide specific, actionable feedback

## 📦 Release Process

1. **Version bumping**: Update version numbers in package.json files
2. **Changelog**: Update CHANGELOG.md with new features and fixes
3. **Testing**: Run full test suite
4. **Documentation**: Update documentation as needed
5. **Tagging**: Create a git tag for the release

## 🎯 Areas for Contribution

### High Priority
- **Performance optimization**: Improve app loading times
- **Mobile responsiveness**: Better mobile experience
- **Accessibility**: Add screen reader support, keyboard navigation
- **Testing**: Increase test coverage

### Medium Priority
- **New quiz types**: True/false, fill-in-the-blank, etc.
- **User profiles**: Enhanced user management
- **Analytics**: Learning progress analytics
- **Social features**: Sharing quizzes, leaderboards

### Low Priority
- **Themes**: Light theme option
- **Internationalization**: Multi-language support
- **Offline support**: Progressive Web App features
- **Integrations**: LMS integrations, export features

## 📞 Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Create issues for bugs and feature requests
- **Email**: Contact maintainers for urgent matters

## 📄 License

By contributing to Smart Learning Path, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md Contributors section
- Release notes
- Project documentation

Thank you for contributing to Smart Learning Path! 🎓✨
