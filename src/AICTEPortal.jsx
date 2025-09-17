import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AICTEPortal.css';

function AICTEPortal() {
  const totalPoints = 150;
  const clubs = ["Tech Club", "Sports Club", "Cultural Club"];
  const events = [
    {
      sr: 1,
      date: "2023-09-15",
      club: "Tech Club",
      event: "Hackathon",
      duration: "2 days",
      points: 20,
      givenBy: "Prof. Sharad",
      details: "Participated in the annual hackathon, developed a web app."
    },
    {
      sr: 2,
      date: "2023-10-20",
      club: "Sports Club",
      event: "Basketball Tournament",
      duration: "1 week",
      points: 15,
      givenBy: "Prof. Preeti",
      details: "Played in the inter-college basketball tournament."
    },
    {
      sr: 3,
      date: "2023-11-05",
      club: "Cultural Club",
      event: "Dance Competition",
      duration: "1 day",
      points: 10,
      givenBy: "Prof. Priyal",
      details: "Performed in the cultural dance event."
    },
  ];
  const monthlyPoints = [
    { month: 'Jan', points: 10 },
    { month: 'Feb', points: 20 },
    { month: 'Mar', points: 15 },
    { month: 'Apr', points: 25 },
    { month: 'May', points: 30 },
    { month: 'Jun', points: 35 },
    { month: 'Jul', points: 40 },
    { month: 'Aug', points: 45 },
    { month: 'Sep', points: 50 },
    { month: 'Oct', points: 55 },
    { month: 'Nov', points: 60 },
    { month: 'Dec', points: 65 },
  ];
  const [expandedRows, setExpandedRows] = useState(new Set());
  const toggleRow = (sr) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(sr)) {
      newExpanded.delete(sr);
    } else {
      newExpanded.add(sr);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="aicte-root">
      <div className="aicte-card fade-section">
        <h1 className="aicte-title">AICTE Student Portal</h1>

        <div className="aicte-points bounce-section">
          <h2 className="aicte-points-title">Total Points</h2>
          <div className="aicte-points-value">{totalPoints}</div>
        </div>

        <div className="aicte-sections">
          <div className="aicte-profile fade-section aicte-profile-wrapper">
            <h2 className="aicte-section-title">Profile - Club Memberships</h2>
            <ul className="aicte-clubs-list">
              {clubs.map((club, index) => (
                <li key={index} className="aicte-club-item">{club}</li>
              ))}
            </ul>
          </div>

          <div className="aicte-graph fade-section aicte-graph-wrapper">
            <h2 className="aicte-section-title">Points Month-wise</h2>
            <div className="aicte-graph-area">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a4d91" />
                  <XAxis dataKey="month" stroke="#1a4d91" fontFamily="Poppins, sans-serif" fontWeight="600" />
                  <YAxis stroke="#1a4d91" fontFamily="Poppins, sans-serif" fontWeight="600" />
                  <Tooltip contentStyle={{ background: '#1a4d91', border: '1px solid #0f294d', borderRadius: '8px', color: '#fff', fontFamily: 'Poppins, sans-serif' }} />
                  <Line type="monotone" dataKey="points" stroke="#0f294d" strokeWidth={4} dot={{ fill: '#1a4d91', strokeWidth: 2, r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="aicte-table fade-section">
          <h2 className="aicte-section-title">Events</h2>
          <table>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Date</th>
                <th>Club Name</th>
                <th>Event Name</th>
                <th>Duration</th>
                <th>Points Allotted</th>
                <th>Given By</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <React.Fragment key={event.sr}>
                  <tr className={expandedRows.has(event.sr) ? 'expanded bounce-section' : ''}>
                    <td>{event.sr}</td>
                    <td>{event.date}</td>
                    <td>{event.club}</td>
                    <td>{event.event}</td>
                    <td>{event.duration}</td>
                    <td className="aicte-points-cell">{event.points}</td>
                    <td>{event.givenBy}</td>
                    <td>
                      <button className="aicte-toggle-btn" onClick={() => toggleRow(event.sr)}>
                        {expandedRows.has(event.sr) ? 'Hide' : 'Show'} Details
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(event.sr) && (
                    <tr className="details-row bounce-section">
                      <td colSpan="8"><strong className="aicte-details-strong">Event Details:</strong> {event.details}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="aicte-back-container">
          <a href="/" className="aicte-back-btn">Back to Home</a>
        </div>
      </div>
    </div>
  );
}

export default AICTEPortal;
