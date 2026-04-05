import React from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import './AdmissionPage.css';

function AdmissionFeesPage() {
  // --- Config / constants ---
  const yearAmounts = { '1': 100000, '2': 120000, '3': 140000, '4': 16000 };
  const roomCharges = { Single: 8000, Double: 5000, Dormitory: 3000 };
  const messCharges = { Veg: 2000, 'Non-Veg': 3000 };

  // --- State ---
  const [year, setYear] = React.useState('1');
  const [hostel, setHostel] = React.useState('Yes');
  const [payments, setPayments] = React.useState({ '1': false, '2': false, '3': false, '4': false });
  const [allReceipts, setAllReceipts] = React.useState([]);
  const [hostelRoom, setHostelRoom] = React.useState('Single');
  const [hostelMess, setHostelMess] = React.useState('Veg');
  const [paymentGateway, setPaymentGateway] = React.useState('UPI');
  const [showGateway, setShowGateway] = React.useState(false);
  const [availableRooms, setAvailableRooms] = React.useState([]);
  const [allocatedRoom, setAllocatedRoom] = React.useState(null);
  const [allocationMsg, setAllocationMsg] = React.useState('');

  // Fetch rooms from JSON (simulate backend)
  React.useEffect(() => {
    fetch('/hostelRooms.json')
      .then(res => res.json())
      .then(data => setAvailableRooms(data))
      .catch(() => setAvailableRooms([]));
  }, []);
  // Room allocation handler (simulate backend update)
  const handleAllocateRoom = async (roomNo) => {
    const room = availableRooms.find(r => r.roomNo === roomNo);
    if (room && room.available) {
      setAllocatedRoom(roomNo);
      // Simulate backend update (would be a POST/PUT in real app)
      setAvailableRooms(availableRooms.map(r => r.roomNo === roomNo ? { ...r, available: false } : r));
      setAllocationMsg(`Room ${roomNo} allocated successfully!`);
      setTimeout(() => setAllocationMsg(''), 3000);
      // TODO: Integrate with backend API here
    } else {
      setAllocationMsg(`Room ${roomNo} is not available.`);
      setTimeout(() => setAllocationMsg(''), 3000);
    }
  };

  // --- Derived values ---
  const nextUnpaidYear = Object.keys(payments).find((y) => !payments[y]);
  const canPay = !!nextUnpaidYear && year === nextUnpaidYear;
  let totalAmount = yearAmounts[year] || 0;
  if (hostel === 'Yes') totalAmount += (roomCharges[hostelRoom] || 0) + (messCharges[hostelMess] || 0);
  const remainingAmount = payments[year] ? 0 : totalAmount;
  const paymentStatus = payments[year] ? 'Done' : 'Not Done';

  // --- Handlers ---
  const handleYear = (v) => {
    setYear(v);
    setShowGateway(false);
  };

  const handleHostel = (v) => {
    setHostel(v);
    if (v === 'No') {
      setHostelRoom('Single');
      setHostelMess('Veg');
    }
  };

  const handleMakePayment = (e) => {
    e.preventDefault();
    setShowGateway(true);
  };

  const downloadReceiptPDF = (receipt) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Admission Payment Receipt', 20, 20);
    doc.setFontSize(12);
    let y = 35;
    doc.text(`Receipt No: ${receipt.receiptNo}`, 20, y); y += 8;
    doc.text(`Date: ${receipt.date}`, 20, y); y += 8;
    if (receipt.studentName) { doc.text(`Student: ${receipt.studentName}`, 20, y); y += 8; }
    if (receipt.branch) { doc.text(`Branch: ${receipt.branch}`, 20, y); y += 8; }
    if (receipt.division) { doc.text(`Division: ${receipt.division}`, 20, y); y += 8; }
    doc.text(`Year: ${receipt.year}`, 20, y); y += 8;
    doc.text(`Hostel: ${receipt.hostel}`, 20, y); y += 8;
    if (receipt.hostel === 'Yes') {
      doc.text(`Room Type: ${receipt.hostelRoom}`, 20, y); y += 8;
      doc.text(`Mess: ${receipt.hostelMess}`, 20, y); y += 8;
    }
    doc.text(`Payment Gateway: ${receipt.paymentGateway}`, 20, y); y += 8;
    doc.text(`Amount Paid: ₹${receipt.amount}`, 20, y); y += 8;
    doc.save(`receipt_${receipt.receiptNo}.pdf`);
  };

  const handleGatewayPayment = (e) => {
    e.preventDefault();
    // mark payment done for selected year
    const newPayments = { ...payments, [year]: true };
    setPayments(newPayments);
    setShowGateway(false);

    // create receipt
    const receipt = {
      year,
      hostel,
      hostelRoom,
      hostelMess,
      paymentGateway,
      amount: totalAmount,
      date: new Date().toLocaleString(),
      receiptNo: 'RCPT' + Date.now(),
      // optional student info (update as needed)
      studentName: 'Ashish Choudhary',
      branch: 'AI&DS',
      division: 'A'
    };
    const updatedReceipts = [...allReceipts.filter((r) => r.year !== year), receipt];
    setAllReceipts(updatedReceipts);

    // small delay so UI updates (keeps UX similar to original)
    setTimeout(() => downloadReceiptPDF(receipt), 100);
    alert(`Payment for Year ${year} Successful via ${paymentGateway}!`);
  };

  // --- Student info (constants; you can wire these to form inputs later) ---
  const studentName = 'Ashish Choudhary';
  const branch = 'AI&DS';
  const division = 'A';
  const rollno = '66';

  // --- Render ---
  return (
    <div className="admission-page">
      <div className="bg-shape top-left" />
      <div className="bg-shape bottom-right" />

      <div className="admission-container">
        <form onSubmit={showGateway ? handleGatewayPayment : handleMakePayment} className="admission-form">
          <div className="row mb-32">
            <div className="col" style={{ minWidth: 180 }}>
              <label className="adm-label" style={{ color: '#43cea2' }}>
                Name
                <input type="text" value={studentName} readOnly className="adm-input" />
              </label>
            </div>

            <div className="col" style={{ minWidth: 160 }}>
              <label className="adm-label">
                Branch
                <input type="text" value={branch} readOnly className="adm-input" />
              </label>
            </div>

            <div className="col" style={{ minWidth: 120 }}>
              <label className="adm-label" style={{ color: '#43cea2' }}>
                Division
                <input type="text" value={division} readOnly className="adm-input" />
              </label>
            </div>

            <div className="col" style={{ minWidth: 100 }}>
              <label className="adm-label">
                Roll No
                <input type="text" value={rollno} readOnly className="adm-input" />
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label className="adm-label" style={{ fontWeight: 700, color: '#2563eb', fontSize: 18 }}>
                Year
                <select value={year} onChange={(e) => handleYear(e.target.value)} className="adm-select">
                  <option value="1">1st Year</option>
                  <option value="2" disabled={!payments['1']}>2nd Year</option>
                  <option value="3" disabled={!payments['2']}>3rd Year</option>
                  <option value="4" disabled={!payments['2'] || !payments['3']}>4th Year</option>
                </select>
              </label>
            </div>

            <div className="col">
              <label className="adm-label" style={{ fontWeight: 700, color: '#2563eb', fontSize: 18 }}>
                Hostel
                <select value={hostel} onChange={(e) => handleHostel(e.target.value)} disabled={payments[year]} className="adm-select">
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>
            </div>
          </div>

          {hostel === 'Yes' && (
            <>
              <div className="row mt-12">
                <div className="col">
                  <label className="adm-label" style={{ fontWeight: 700, color: '#2563eb', fontSize: 18 }}>
                    Room Type
                    <select value={hostelRoom} onChange={(e) => { setHostelRoom(e.target.value); }} disabled={payments[year]} className="adm-select">
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Dormitory">Dormitory</option>
                    </select>
                  </label>
                </div>
                <div className="col">
                  <label className="adm-label" style={{ fontWeight: 700, color: '#2563eb', fontSize: 18 }}>
                    Mess
                    <select value={hostelMess} onChange={(e) => { setHostelMess(e.target.value); }} disabled={payments[year]} className="adm-select">
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="hostel-card">
                <h3>Hostel Available Rooms</h3>
                <table className="adm-table">
                  <thead>
                    <tr style={{ background: '#43cea2', color: '#fff' }}>
                      <th>Room No</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableRooms
                      .filter(room => room.type === hostelRoom)
                      .map(room => (
                        <tr key={room.roomNo} className={!room.available ? 'unavailable' : ''}>
                          <td>{room.roomNo}</td>
                          <td>{room.type}</td>
                          <td className={room.available ? 'status-available' : 'status-allocated'}>{room.available ? 'Available' : 'Allocated'}</td>
                          <td>
                            {room.available ? (
                              <button
                                type="button"
                                className="primary-btn"
                                onClick={() => handleAllocateRoom(room.roomNo)}
                                disabled={!!allocatedRoom || payments[year]}
                              >
                                Allocate
                              </button>
                            ) : (
                              <span style={{ color: '#dc2626', fontWeight: 700 }}>Not Available</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {allocatedRoom && (
                  <div className="msg-success" style={{ fontSize: 18 }}>
                    Allocated Room No: {allocatedRoom}
                  </div>
                )}
                {allocationMsg && (
                  <div className={allocationMsg.includes('successfully') ? 'msg-success' : 'msg-error'}>
                    {allocationMsg}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="row mt-24">
            <div className="col meta">Remaining Amount: <span className="value">₹{remainingAmount}</span></div>
            <div className="col meta">Status: <span className={paymentStatus === 'Done' ? 'done' : 'pending'}>{paymentStatus}</span></div>
          </div>

          {!showGateway && paymentStatus === 'Not Done' && canPay && (
            <div className="center mt-32">
              <button
                type="submit"
                className="primary-btn half"
              >
                Pay Now
              </button>
            </div>
          )}

          {showGateway && paymentStatus === 'Not Done' && canPay && (
            <div className="row mt-32">
              <div className="col">
                <label className="adm-label" style={{ fontWeight: 700, color: '#1976d2', fontSize: 18 }}>
                  Payment Gateway
                  <select value={paymentGateway} onChange={(e) => { setPaymentGateway(e.target.value); }} className="adm-select">
                    <option value="UPI">UPI</option>
                    <option value="Credit/Debit Card">Credit/Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="College Bank Details">College Bank Details</option>
                  </select>
                </label>
              </div>

              <div className="col">
                <button
                  type="submit"
                  className="primary-btn"
                >
                  Pay Now
                </button>
              </div>
            </div>
          )}

          {!canPay && paymentStatus === 'Not Done' && (
            <div className="msg-error center" style={{ fontSize: 18, marginTop: 20 }}>Please pay for previous year(s) first.</div>
          )}

          {payments[year] && (
            <div className="center" style={{ marginTop: 18 }}>
              <button
                type="button"
                onClick={() => {
                  const receipt = allReceipts.find((r) => r.year === year) || {
                    year,
                    hostel,
                    hostelRoom,
                    hostelMess,
                    paymentGateway,
                    amount: yearAmounts[year] + (hostel === 'Yes' ? (roomCharges[hostelRoom] + messCharges[hostelMess]) : 0),
                    date: new Date().toLocaleString(),
                    receiptNo: 'RCPT-' + year + '-' + Date.now(),
                    generated: true,
                    studentName,
                    branch,
                    division,
                  };
                  downloadReceiptPDF(receipt);
                }}
                className="primary-btn half"
              >
                Download Receipt (PDF)
              </button>
              <div className="msg-success" style={{ marginTop: 10, fontSize: 18 }}>Receipt available for Year {year}</div>
            </div>
          )}
        </form>
        <div className="center" style={{ marginTop: 36 }}>
          <Link to="/" className="back-link">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default AdmissionFeesPage;
