import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Resources.css';

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const resources = [
    {
      id: 1,
      title: "Complete Guide to Machine Learning",
      description: "A comprehensive guide covering all aspects of machine learning from basics to advanced topics.",
      category: "ai-ml",
      type: "guide",
      duration: "45 min read",
      level: "Beginner",
      image: "📚",
      tags: ["Machine Learning", "AI", "Data Science"],
      featured: true,
      link: "https://www.coursera.org/learn/machine-learning"
    },
    {
      id: 2,
      title: "Python Programming Masterclass",
      description: "Master Python programming with this interactive course designed for beginners and intermediate learners.",
      category: "programming",
      type: "course",
      duration: "12 hours",
      level: "Intermediate",
      image: "🐍",
      tags: ["Python", "Programming", "Development"],
      featured: true,
      link: "https://www.codecademy.com/learn/learn-python-3"
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      description: "Learn the core concepts of data science including statistics, visualization, and analysis techniques.",
      category: "data-science",
      type: "tutorial",
      duration: "30 min read",
      level: "Beginner",
      image: "📊",
      tags: ["Data Science", "Statistics", "Analytics"],
      featured: false,
      link: "https://www.kaggle.com/learn/intro-to-machine-learning"
    },
    {
      id: 4,
      title: "Web Development Bootcamp",
      description: "Full-stack web development course covering HTML, CSS, JavaScript, React, and Node.js.",
      category: "programming",
      type: "course",
      duration: "20 hours",
      level: "Advanced",
      image: "🌐",
      tags: ["Web Development", "React", "JavaScript"],
      featured: true,
      link: "https://www.freecodecamp.org/learn/responsive-web-design/"
    },
    {
      id: 5,
      title: "AI Ethics and Responsible AI",
      description: "Understanding the ethical implications of AI and how to develop responsible AI systems.",
      category: "ai-ml",
      type: "article",
      duration: "15 min read",
      level: "Intermediate",
      image: "🤖",
      tags: ["AI Ethics", "Responsible AI", "Technology"],
      featured: false,
      link: "https://ethics.fast.ai/"
    },
    {
      id: 6,
      title: "Database Design Principles",
      description: "Learn database design best practices, normalization, and optimization techniques.",
      category: "database",
      type: "guide",
      duration: "25 min read",
      level: "Intermediate",
      image: "🗄️",
      tags: ["Database", "SQL", "Design"],
      featured: false,
      link: "https://www.w3schools.com/sql/"
    },
    {
      id: 7,
      title: "Mobile App Development with React Native",
      description: "Build cross-platform mobile applications using React Native framework.",
      category: "programming",
      type: "tutorial",
      duration: "8 hours",
      level: "Advanced",
      image: "📱",
      tags: ["Mobile Development", "React Native", "JavaScript"],
      featured: true,
      link: "https://reactnative.dev/docs/tutorial"
    },
    {
      id: 8,
      title: "Cloud Computing Fundamentals",
      description: "Introduction to cloud services, deployment models, and cloud architecture patterns.",
      category: "cloud",
      type: "course",
      duration: "6 hours",
      level: "Beginner",
      image: "☁️",
      tags: ["Cloud Computing", "AWS", "DevOps"],
      featured: false,
      link: "https://aws.amazon.com/training/digital/"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: '📋' },
    { id: 'ai-ml', name: 'AI & Machine Learning', icon: '🤖' },
    { id: 'programming', name: 'Programming', icon: '💻' },
    { id: 'data-science', name: 'Data Science', icon: '📊' },
    { id: 'database', name: 'Database', icon: '🗄️' },
    { id: 'cloud', name: 'Cloud Computing', icon: '☁️' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredResources = resources.filter(resource => resource.featured);

  return (
    <div className="resources-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <div className="logo-icon">🧠</div>
            <span className="logo-text">SmartLearn</span>
          </Link>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/learning-path" className="nav-link">Learning Paths</Link>
            <Link to="/quiz-generator" className="nav-link">Quiz Generator</Link>
            <Link to="/resources" className="nav-link active">Resources</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="resources-header">
        <div className="container">
          <div className="header-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <span>Resources</span>
            </div>
            <h1 className="page-title">Learning Resources</h1>
            <p className="page-description">
              Discover curated learning materials, tutorials, and guides to accelerate your learning journey. 
              From beginner-friendly articles to advanced courses, find the perfect resources for your skill level.
            </p>
            
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search resources, topics, or technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {selectedCategory === 'all' && !searchTerm && (
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <h2>Featured Resources</h2>
              <p>Handpicked content to jumpstart your learning</p>
            </div>
            
            <div className="featured-grid">
              {featuredResources.map((resource) => (
                <div key={resource.id} className="featured-card">
                  <div className="card-header">
                    <div className="card-icon">{resource.image}</div>
                    <div className="card-badge featured-badge">Featured</div>
                  </div>
                  <div className="card-content">
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <div className="card-meta">
                      <span className="meta-item">
                        <span className="meta-icon">⏱️</span>
                        {resource.duration}
                      </span>
                      <span className="meta-item">
                        <span className="meta-icon">📊</span>
                        {resource.level}
                      </span>
                      <span className="meta-item">
                        <span className="meta-icon">📝</span>
                        {resource.type}
                      </span>
                    </div>
                    <div className="card-tags">
                      {resource.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="card-actions">
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary"
                    >
                      Start Learning
                      <span className="arrow">→</span>
                    </a>
                    <button className="btn-bookmark">
                      <span>🔖</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories and Resources */}
      <section className="resources-section">
        <div className="container">
          {/* Categories Filter */}
          <div className="categories-filter">
            <h3>Browse by Category</h3>
            <div className="categories-grid">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">
                    {category.id === 'all' 
                      ? resources.length 
                      : resources.filter(r => r.category === category.id).length
                    }
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          <div className="resources-grid-section">
            <div className="section-header">
              <h3>
                {selectedCategory === 'all' ? 'All Resources' : 
                 categories.find(c => c.id === selectedCategory)?.name || 'Resources'}
              </h3>
              <p>{filteredResources.length} resources found</p>
            </div>

            {filteredResources.length > 0 ? (
              <div className="resources-grid">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="resource-card">
                    <div className="card-header">
                      <div className="card-icon">{resource.image}</div>
                      {resource.featured && (
                        <div className="card-badge">⭐ Featured</div>
                      )}
                    </div>
                    <div className="card-content">
                      <h4>{resource.title}</h4>
                      <p>{resource.description}</p>
                      <div className="card-meta">
                        <span className="meta-item">
                          <span className="meta-icon">⏱️</span>
                          {resource.duration}
                        </span>
                        <span className="meta-item">
                          <span className="meta-icon">📊</span>
                          {resource.level}
                        </span>
                      </div>
                      <div className="card-tags">
                        {resource.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                        {resource.tags.length > 2 && (
                          <span className="tag-more">+{resource.tags.length - 2}</span>
                        )}
                      </div>
                    </div>
                    <div className="card-actions">
                      <button className="btn-primary small">
                        Learn More
                        <span className="arrow">→</span>
                      </button>
                      <button className="btn-bookmark small">
                        🔖
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No resources found</h3>
                <p>Try adjusting your search or browse different categories.</p>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Learning?</h2>
            <p>Create your personalized learning path and track your progress with SmartLearn's AI-powered platform.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-primary large">
                Get Started Free
                <span className="arrow">→</span>
              </Link>
              <Link to="/learning-path" className="btn-outline large">
                Create Learning Path
                <span className="icon">🎯</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-icon">🧠</div>
                <span className="logo-text">SmartLearn</span>
              </div>
              <p className="footer-description">
                Empowering learners worldwide with AI-driven education technology.
              </p>
            </div>
            
            <div className="footer-section">
              <h4>Platform</h4>
              <Link to="/learning-path">Learning Paths</Link>
              <Link to="/quiz-generator">Quiz Generator</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/blog">Blog</Link>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <Link to="/contact">Contact Us</Link>
              <Link to="/help">Help Center</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 SmartLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Resources;
