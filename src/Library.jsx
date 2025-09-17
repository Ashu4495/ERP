import React, { useState, useEffect } from "react";
import './Library.css';

// Static data moved to module scope to avoid re-creation on every render
const CATEGORIES = ['EGD', 'SC', 'NWT', 'AT', 'SSIC'];

const BOOKS = [
  { id: 'EGD001', title: 'Understanding EGD Concepts', author: 'Author A', category: 'EGD' },
  { id: 'EGD002', title: 'EGD in Practice', author: 'Author B', category: 'EGD' },
  { id: 'EGD003', title: 'Advanced EGD Techniques', author: 'Author C', category: 'EGD' },
  { id: 'EGD004', title: 'EGD Case Studies', author: 'Author D', category: 'EGD' },
  { id: 'EGD005', title: 'EGD Fundamentals', author: 'Author E', category: 'EGD' },
  { id: 'SC001', title: 'Science Basics', author: 'Author F', category: 'SC' },
  { id: 'SC002', title: 'Applied Science', author: 'Author G', category: 'SC' },
  { id: 'SC003', title: 'Science Experiments', author: 'Author H', category: 'SC' },
  { id: 'SC004', title: 'Modern Science', author: 'Author I', category: 'SC' },
  { id: 'SC005', title: 'Science and Technology', author: 'Author J', category: 'SC' },
  { id: 'NWT001', title: 'Introduction to NWT', author: 'Author K', category: 'NWT' },
  { id: 'NWT002', title: 'NWT Applications', author: 'Author L', category: 'NWT' },
  { id: 'NWT003', title: 'NWT Advanced Topics', author: 'Author M', category: 'NWT' },
  { id: 'NWT004', title: 'NWT Research', author: 'Author N', category: 'NWT' },
  { id: 'NWT005', title: 'NWT Fundamentals', author: 'Author O', category: 'NWT' },
  { id: 'AT001', title: 'AT Principles', author: 'Author P', category: 'AT' },
  { id: 'AT002', title: 'Applied AT', author: 'Author Q', category: 'AT' },
  { id: 'AT003', title: 'AT Techniques', author: 'Author R', category: 'AT' },
  { id: 'AT004', title: 'AT Case Studies', author: 'Author S', category: 'AT' },
  { id: 'AT005', title: 'AT Fundamentals', author: 'Author T', category: 'AT' },
  { id: 'SSIC001', title: 'SSIC Overview', author: 'Author U', category: 'SSIC' },
  { id: 'SSIC002', title: 'SSIC Methods', author: 'Author V', category: 'SSIC' },
  { id: 'SSIC003', title: 'SSIC Applications', author: 'Author W', category: 'SSIC' },
  { id: 'SSIC004', title: 'SSIC Research', author: 'Author X', category: 'SSIC' },
  { id: 'SSIC005', title: 'SSIC Fundamentals', author: 'Author Y', category: 'SSIC' },
];

const RECENT_BOOKS = [ { id: 'RB001', title: 'Product #011', price: '$16.99', image: 'https://via.placeholder.com/60x80?text=Book+1' } ];

function Library() {
  const [currentPage, setCurrentPage] = useState('books');
  const [selectedBooks, setSelectedBooks] = useState([]); // changed to array for multiple selection
  const [erpId, setErpId] = useState('');
  const [name, setName] = useState('');
  const [courseYear, setCourseYear] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);

  const categories = CATEGORIES;

  const books = BOOKS;
  const recentBooks = RECENT_BOOKS;

  // keep recentBooks available for future UI (hidden to avoid unused var lint)
  const _recentCount = recentBooks.length;

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    let filtered = books;
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }
    setFilteredBooks(filtered);
  }, [searchTerm, selectedCategory, books]);

  const handleBookClick = (book) => {
    // Toggle selection for multiple books, limit to 2
    if (selectedBooks.some(b => b.id === book.id)) {
      setSelectedBooks(selectedBooks.filter(b => b.id !== book.id));
    } else {
      if (selectedBooks.length < 2) {
        setSelectedBooks([...selectedBooks, book]);
      } else {
        alert('You can select up to 2 books only.');
      }
    }
  };

  const handleBack = () => {
    setCurrentPage('books');
    setSelectedBooks([]);
    setErpId('');
    setName('');
    setCourseYear('');
    setAcknowledged(false);
  };

  if (currentPage === 'books') {
    return (
      <div className="library-root">
        <nav className="library-nav">
          <div className="library-nav-links">
            {['Home', 'New Books', 'Specials', 'All Books', 'FAQs', 'Contact Us'].map((item) => (
              <a key={item} href={item === 'Home' ? '/' : '#'} className="library-nav-link">{item}</a>
            ))}
          </div>
          <div>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="library-search-input"
            />
            <button className="library-search-btn">🔍</button>
          </div>
        </nav>

        <div className="library-content">
          <aside className="library-aside">
            <h3 className="library-aside-title">Categories</h3>
            <ul className="library-categories">
              {categories.map(cat => (
                <li key={cat} style={{ marginBottom: 8 }}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`library-category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`library-category-btn ${!selectedCategory ? 'active' : ''}`}
                >
                  All Categories
                </button>
              </li>
            </ul>
          </aside>

          <main className="library-main">
            <h3 className="library-main-title">Featured Books</h3>
            <div className="library-grid">
              {filteredBooks.map(book => {
                const isSelected = selectedBooks.some(b => b.id === book.id);
                return (
                  <div key={book.id} className={`library-card ${isSelected ? 'selected' : ''}`}>
                    <h4 className="library-card-title">{book.title}</h4>
                    <p className="library-card-author">Author: {book.author}</p>
                    <p className="library-card-category">Category: {book.category}</p>
                    <button onClick={() => handleBookClick(book)} className={`library-card-btn ${isSelected ? 'selected' : ''}`}>
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
            {selectedBooks.length > 0 && (
              <div className="library-cta">
                <button onClick={() => setCurrentPage('booking')} className="library-cta-btn">
                  Final Booking ({selectedBooks.length})
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  } else if (currentPage === 'booking') {
    const reservationDate = new Date().toLocaleDateString();
    const expectedReturn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!erpId.trim() || !name.trim() || !courseYear.trim() || !acknowledged) {
        alert('Please fill all required fields and acknowledge the policies.');
        return;
      }
      alert(`Booking successful!\nStudent: ${name} (ERP: ${erpId})\nBooks: ${selectedBooks.map(b => b.title).join(', ')}\nReservation: ${reservationDate}\nReturn: ${expectedReturn}`);
      setCurrentPage('books');
      setSelectedBooks([]);
      setErpId('');
      setName('');
      setCourseYear('');
      setAcknowledged(false);
    };

    // Fonts are included in index.html for better caching and performance

    return (
      <div className="library-booking-root">
        <form className="reservation-form" onSubmit={handleSubmit}>
          <h2>Book Reservation</h2>
          <fieldset>
            <legend>Student Info</legend>
            <label>
              ERP ID (Primary Key - Mandatory):
              <input type="text" value={erpId} onChange={e => setErpId(e.target.value)} required />
            </label>
            <label>
              Student Name:
              <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>
              Course/Year:
              <input type="text" value={courseYear} onChange={e => setCourseYear(e.target.value)} required />
            </label>
          </fieldset>
          <fieldset>
            <legend>Books Info</legend>
            {selectedBooks.map(book => (
              <div key={book.id} className="book-info">
                <p>Book ID / Accession No.: {book.id}</p>
                <p>Book Title: {book.title}</p>
                <p>Author Name: {book.author}</p>
                <p>Category / Subject: {book.category}</p>
                <hr />
              </div>
            ))}
          </fieldset>
          <fieldset>
            <legend>Booking Details</legend>
            <div className="details">Reservation Date: {reservationDate}</div>
            <div className="details">Expected Return Date: {expectedReturn}</div>
            <label>
              <input type="checkbox" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)} />
              Acknowledgment: I agree to library policies and late fee.
            </label>
          </fieldset>
          <div className="form-actions">
            <button type="submit">Book Now</button>
            <button type="button" onClick={handleBack}>Back to Books</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Library;
