import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  LinearProgress,
  Grid,
  Collapse,
  Fade,
  Grow,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
} from 'recharts';
import { jsPDF } from 'jspdf';

import './StudentPortal.css';
import logoImg from './assets/logo.jpeg';

// Static data lifted to module scope for better performance and stable references
const SUBJECTS = [
  { name: 'NWT', percent: 85 },
  { name: 'AT', percent: 78 },
  { name: 'SC', percent: 90 },
  { name: 'ML', percent: 82 },
  { name: 'IC', percent: 75 },
  { name: 'SSIC', percent: 88 },
  { name: 'Tutorial', percent: 92 },
];

const PRACTICALS = [
  { name: 'Practical 1', percent: 88 },
  { name: 'Practical 2', percent: 95 },
  { name: 'Practical 3', percent: 80 },
];

const EVENTS = [
  { date: '2025-07-01', label: 'Induction/Orientation/Pre-req courses', type: 'Event' },
  { date: '2025-08-27', label: 'Ganpati Festival Break (5 days)', type: 'Holiday' },
  { date: '2025-09-01', label: 'In-Semester Examination-I', type: 'Exam' },
  { date: '2025-09-25', label: 'Technical Festival (Zephyr)', type: 'Event' },
  { date: '2025-10-15', label: 'In-Semester Examination-II', type: 'Exam' },
  { date: '2025-10-18', label: 'Diwali Break (8 days)', type: 'Holiday' },
  { date: '2025-10-27', label: 'Practice Session & Doubt Solving', type: 'Event' },
  { date: '2025-10-29', label: 'Last Instructional Day', type: 'Event' },
  { date: '2025-10-30', label: 'Term Work Submission', type: 'Event' },
  { date: '2025-11-03', label: 'ESE Oral/Practical Exam', type: 'Exam' },
  { date: '2025-11-10', label: 'Preparatory Leave & ATKT Exams', type: 'Exam' },
  { date: '2025-11-24', label: 'End Semester Exam (Odd Sem)', type: 'Exam' },
  { date: '2025-12-08', label: 'In-House Internship (S.E./S.T.) Part I', type: 'Event' },
  { date: '2025-12-15', label: 'Semester Break (S.E./S.T.)', type: 'Holiday' },
  { date: '2026-01-05', label: 'In-House Internship (S.E./S.T.) Part II', type: 'Event' },
  { date: '2025-12-08', label: 'Semester Break & Outhouse Internship (T.E./T.T.)', type: 'Holiday' },
];

const SYLLABUS_SUBJECTS = ['NWT', 'AT', 'SC', 'ML', 'IC', 'SSIC'];

export default function StudentPortal() {
  const [showAttendance] = useState(true);
  const [animMode] = useState('grow'); // 'grow' | 'fade' | 'slide'
  // Toggle to simulate teacher-only edit access. In production replace with real auth.
  const [isTeacher] = useState(false);

  // Memoized static datasets
  const subjects = useMemo(() => SUBJECTS, []);
  const practicals = useMemo(() => PRACTICALS, []);
  const subjectAvg = useMemo(() => Math.round(subjects.reduce((s, x) => s + x.percent, 0) / subjects.length), [subjects]);
  const practicalAvg = useMemo(() => Math.round(practicals.reduce((s, x) => s + x.percent, 0) / practicals.length), [practicals]);
  const overall = useMemo(() => Math.round((subjectAvg + practicalAvg) / 2), [subjectAvg, practicalAvg]);

  const renderAnimated = (children, key) => {
    const timeout = 400;
    if (animMode === 'grow') return <Grow in={showAttendance} timeout={timeout} key={key}>{children}</Grow>;
    if (animMode === 'fade') return <Fade in={showAttendance} timeout={timeout} key={key}>{children}</Fade>;
    // slide implemented via Collapse (vertical)
    return <Collapse in={showAttendance} timeout={timeout} key={key}>{children}</Collapse>;
  };

  // Calendar state and events
  const [calendarCursor, setCalendarCursor] = useState(dayjs().startOf('month'));
  const events = EVENTS;

  // days grid helper
  const daysGrid = useMemo(() => {
    const start = calendarCursor.startOf('month');
    const end = calendarCursor.endOf('month');
    const leading = start.day();
    const total = end.date();
    const blanks = Array.from({ length: leading }).map(() => null);
    const days = Array.from({ length: total }).map((_, i) => start.date(i + 1));
    return [...blanks, ...days];
  }, [calendarCursor]);

  // Syllabus coverage
  const syllabusData = useMemo(() => SYLLABUS_SUBJECTS.map((subject, idx) => {
    const modules = Array.from({ length: 6 }).map((_, m) => ({
      label: `M${m + 1}`,
      done: (m + idx) % 6 < (3 + (idx % 3)),
    }));
    const completed = modules.filter(m => m.done).length;
    return { subject, modules, completed, total: 6, percent: Math.round((completed / 6) * 100) };
  }), []);

  // Exam results sample data (two-series per semester: theory and practical), values on 0-10 scale
  const examResults = [
    { sem: 1, theory: 6.2, practical: 6.8 },
    { sem: 2, theory: 6.8, practical: 6.5 },
    { sem: 3, theory: 7.1, practical: 6.9 },
    { sem: 4, theory: 6.9, practical: 6.4 },
    { sem: 5, theory: 7.4, practical: 7.1 },
    { sem: 6, theory: 7.6, practical: 7.3 },
    { sem: 7, theory: 8.0, practical: 7.8 },
    { sem: 8, theory: 8.5, practical: 8.2 },
  ];

  // Gazette items (sample) — will generate PDFs on demand
  const gazetteLinks = Array.from({ length: 8 }, (_, idx) => ({ sem: idx + 1 }));

  const downloadGazette = (sem) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Gazette - Semester ${sem}`, 14, 22);
      doc.setFontSize(11);
      doc.text(`This is a sample gazette for Semester ${sem}.`, 14, 36);
      doc.text(`Generated on: ${dayjs().format('YYYY-MM-DD HH:mm')}`, 14, 46);
      // placeholder content
      doc.setFontSize(10);
      const lorem = 'This gazette contains important notices, circulars and academic information related to the semester.';
      doc.text(lorem, 14, 62, { maxWidth: 180 });
      doc.save(`Gazette_Semester_${sem}.pdf`);
    } catch (err) {
      alert('Failed to generate gazette PDF: ' + err.message);
    }
  };

  // Interactive syllabus state persisted to localStorage
  const [syllabusState, setSyllabusState] = useState(() => {
    try {
      const raw = localStorage.getItem('syllabusState');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore parsing errors and use defaults
    }
    // default from syllabusData
    return syllabusData.map(s => s.modules.map(m => m.done));
  });

  useEffect(() => {
    try { localStorage.setItem('syllabusState', JSON.stringify(syllabusState)); } catch (err) { console.warn('Failed to save syllabusState', err); }
  }, [syllabusState]);

  const toggleModule = (subjectIdx, moduleIdx) => {
    if (!isTeacher) return; // only teacher can modify
    setSyllabusState(prev => {
      const copy = prev.map(arr => [...arr]);
      copy[subjectIdx][moduleIdx] = !copy[subjectIdx][moduleIdx];
      return copy;
    });
  };

  const markAllDone = () => {
    if (!isTeacher) return;
    setSyllabusState(syllabusData.map(s => Array.from({ length: s.total }).map(() => true)));
  };

  const clearAll = () => {
    if (!isTeacher) return;
    setSyllabusState(syllabusData.map(s => Array.from({ length: s.total }).map(() => false)));
  };

  // Animate Exam Results entrance
  const [showExam] = useState(true);

  const navigate = useNavigate();

  // Profile menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const profileOpen = Boolean(anchorEl);
  const handleProfileClick = (e) => setAnchorEl(e.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const handleProfileAction = (action) => {
    handleProfileClose();
    if (action === 'student') navigate('/student-portal');
    if (action === 'settings') alert('Open settings (not implemented)');
    if (action === 'logout') alert('Logged out (client-side only)');
  };

  // (screenshots/lightbox removed)

  return (
    <Box className="student-portal-root">
      {/* Profile button hidden as requested */}

      <Box className="sp-sidebar">
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ width: 48, height: 48 }} src={logoImg}>A</Avatar>
            <Box>
              <Typography className="sp-profile-name">Ashish Choudhary</Typography>
              <Typography className="sp-profile-sub" onClick={handleProfileClick}>View Profile ▾</Typography>
            </Box>
          </Box>
          <Menu anchorEl={anchorEl} open={profileOpen} onClose={handleProfileClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
            <MenuItem onClick={() => handleProfileAction('student')}>Student</MenuItem>
            <MenuItem onClick={() => handleProfileAction('settings')}>Settings</MenuItem>
            <MenuItem onClick={() => handleProfileAction('logout')}>Log out</MenuItem>
          </Menu>
          <Stack spacing={1}>
            <Button variant="text" className="sp-nav-btn">Dashboard</Button>
            <Button variant="text" className="sp-nav-btn">Student</Button>
            <Button variant="text" className="sp-nav-btn">Notice Board</Button>
          </Stack>
        </Box>
      </Box>

      <Box className="student-portal-main">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Student Portal
          </Typography>
        </Box>

  <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} sm={6} md={3} lg={3}>
            {renderAnimated(
              <Paper className="sp-card" sx={{ minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', pt: 2, px: 2 }}>
                <Typography variant="h6">Overall</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{overall}%</Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Subjects: {subjectAvg}% • Practicals: {practicalAvg}%</Typography>
              </Paper>
            , 'overall')}
          </Grid>

          {subjects.map((s, idx) => (
            <Grid item xs={6} sm={4} md={2} lg={1} key={s.name}>
              {renderAnimated(
                <Paper className="sp-card" sx={{ textAlign: 'center', minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center', pt: 2, px: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{s.name}</Typography>
                  <Typography variant="h5" sx={{ color: s.percent < 75 ? '#dc2626' : '#22c55e', fontWeight: 700 }}>{s.percent}%</Typography>
                  <LinearProgress variant="determinate" value={s.percent} sx={{ height: 8, borderRadius: 6, mt: 1 }} />
                </Paper>
              , `sub-${idx}`)}
            </Grid>
          ))}

          {/* Practical average card */}
          <Grid item xs={6} sm={4} md={2} lg={2}>
            <Paper className="sp-card" sx={{ textAlign: 'center', minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center', pt: 2, px: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Practical</Typography>
              <Typography variant="h5" sx={{ color: practicalAvg < 75 ? '#dc2626' : '#22c55e', fontWeight: 700 }}>{practicalAvg}%</Typography>
              <LinearProgress variant="determinate" value={practicalAvg} sx={{ height: 8, borderRadius: 6, mt: 1 }} />
            </Paper>
          </Grid>
        </Grid>
        {/* Attendance Details Table */}
  <Paper className="sp-card" sx={{ mt: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Attendance Details</Typography>
            <Button size="small" variant="outlined" onClick={() => navigate('/')}>Back to Home</Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Attendance %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>Subject</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right" sx={{ color: row.percent < 75 ? '#dc2626' : '#22c55e' }}>{row.percent}%</TableCell>
                  </TableRow>
                ))}
                {practicals.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>Practical</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right" sx={{ color: row.percent < 75 ? '#dc2626' : '#22c55e' }}>{row.percent}%</TableCell>
                  </TableRow>
                ))}
                {/* Summary rows */}
                <TableRow>
                  <TableCell /><TableCell sx={{ fontWeight: 700 }}>Subject Avg</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>{subjectAvg}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell /><TableCell sx={{ fontWeight: 700 }}>Practical Avg</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>{practicalAvg}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell /><TableCell sx={{ fontWeight: 900 }}>Overall Avg</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 900 }}>{overall}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
  </Paper>
        {/* Exam Results Section */}
        <Typography variant="h5" sx={{ mb: 2, color: '#0b2239' }}>
          Exam Results
        </Typography>
        <Box className="exam-gazette-row" sx={{ mb: 4 }}>
          <Box className="exam-card">
            <Grow in={showExam} timeout={600}>
              <Paper className="sp-card chart-appear" sx={{ height: 320 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#0b2239' }}>Semester Exam Scores</Typography>
                  <Box className="chart-legend">
                    <Box className="legend-item"><span className="legend-swatch" style={{ background: '#2563eb' }} />Theory</Box>
                    <Box className="legend-item"><span className="legend-swatch" style={{ background: '#06b6d4' }} />Practical</Box>
                  </Box>
                </Box>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={examResults} margin={{ left: -20 }} barGap={6} barCategoryGap={18}>
                    <XAxis dataKey="sem" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                    <RechartsTooltip formatter={(value) => `${value.toFixed(2)} / 10`} />
                    <Bar dataKey="theory" name="Theory" radius={[6, 6, 0, 0]} barSize={18} fill="#2563eb" animationDuration={800}>
                      {examResults.map((entry, index) => (
                        <Cell key={`t-${index}`} fill={entry.theory >= 8 ? '#10b981' : entry.theory >= 7 ? '#34d399' : '#60a5fa'} />
                      ))}
                      <LabelList dataKey="theory" position="top" formatter={(val) => val.toFixed(1)} className="recharts-bar-label" />
                    </Bar>
                    <Bar dataKey="practical" name="Practical" radius={[6, 6, 0, 0]} barSize={18} fill="#06b6d4" animationDuration={900}>
                      {examResults.map((entry, index) => (
                        <Cell key={`p-${index}`} fill={entry.practical >= 8 ? '#059669' : entry.practical >= 7 ? '#10b981' : '#60a5fa'} />
                      ))}
                      <LabelList dataKey="practical" position="top" formatter={(val) => val.toFixed(1)} className="recharts-bar-label" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Box>
          <Box className="gazette-card">
            <Grow in={showExam} timeout={800}>
              <Paper className="sp-card chart-appear" sx={{ height: 320, overflowY: 'auto' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#0b2239' }}>Gazette Downloads</Typography>
                <Stack spacing={1} sx={{ px: 1, py: 0 }}>
                  {gazetteLinks.map(({ sem }) => (
                    <Button
                      key={sem}
                      variant="outlined"
                      onClick={() => downloadGazette(sem)}
                      className="gazette-btn"
                    >
                      Download Sem {sem}
                    </Button>
                  ))}
                </Stack>
              </Paper>
            </Grow>
          </Box>
        </Box>
        {/* Calendar Section */}
        <Typography variant="h5" sx={{ mb: 2, color: '#0b2239' }}>
          Calendar
        </Typography>
        <Paper className="sp-card" sx={{ mb: 4 }}>
          <Box className="cal-header">
            <Typography variant="h6" className="cal-title">
              Holidays & Events
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" onClick={() => setCalendarCursor((prev) => prev.subtract(1, 'month'))}>
                ‹
              </IconButton>
              <Typography sx={{ fontWeight: 700, color: '#0b2239' }}>{calendarCursor.format('MMM YYYY')}</Typography>
              <IconButton size="small" onClick={() => setCalendarCursor((prev) => prev.add(1, 'month'))}>
                ›
              </IconButton>
            </Stack>
          </Box>
          <Box className="cal-grid">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
              <Typography key={d} align="center" className="cal-day-name">
                {d}
              </Typography>
            ))}
            {daysGrid.map((d, i) => {
              if (!d)
                return <Box key={`b-${i}`} sx={{ height: 32 }} />;
              const iso = d.format('YYYY-MM-DD');
              const event = events.find((e) => e.date === iso);
              const bg = event ? (event.type === 'Holiday' ? '#e2f5ff' : event.type === 'Exam' ? '#f4e8ff' : '#e7f0ff') : '#ffffff';
              const bd = event ? '#bfdbfe' : '#e2e8f0';
              const dayBox = (
                <Box className="cal-day-box" style={{ background: bg, borderColor: bd }}>
                  <Typography className="cal-day-num">{d.date()}</Typography>
                  {event && (
                    <Typography sx={{ color: '#2563eb', fontSize: 10, fontWeight: 700, mt: 0.2, textAlign: 'center', lineHeight: 1 }}>
                      {event.label}
                    </Typography>
                  )}
                  {event && <Box className="cal-dot" sx={{ background: event.type === 'Holiday' ? '#60a5fa' : event.type === 'Exam' ? '#f472b6' : '#34d399' }} />}
                </Box>
              );
              return (
                <Tooltip key={iso} title={event ? `${event.label} (${event.type})` : ''} arrow>
                  {dayBox}
                </Tooltip>
              );
            })}
          </Box>
          <Stack direction="row" spacing={1} className="legend">
            <Button size="small" className="legend-btn legend-holiday">
              Holiday
            </Button>
            <Button size="small" className="legend-btn legend-event">
              Event
            </Button>
            <Button size="small" className="legend-btn legend-exam">
              Exam
            </Button>
          </Stack>
        </Paper>

        {/* Syllabus Coverage Section */}
        <Box className="syl-header">
          <Typography variant="h5" sx={{ mb: 2, color: '#0b2239' }}>Syllabus Coverage</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button variant="outlined" size="small" onClick={markAllDone} disabled={!isTeacher}>Mark All Done</Button>
            <Button variant="outlined" size="small" onClick={clearAll} disabled={!isTeacher}>Clear All</Button>
          </Stack>
        </Box>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {syllabusData.map(({ subject, modules, total }) => {
            const idx = SYLLABUS_SUBJECTS.indexOf(subject);
            const states = syllabusState[idx] || Array.from({ length: total }).map(() => false);
            const completedLive = states.filter(Boolean).length;
            const percentLive = Math.round((completedLive / total) * 100);
            return (
            <Grid item xs={12} md={6} lg={4} key={subject}>
              <Paper className="sp-card">
                <Typography variant="h6" sx={{ mb: 1, color: '#0b2239' }}>{subject}</Typography>
                <Box className="syl-bar">
                  {modules.map((m, mi) => (
                    <Box
                      key={m.label}
                      onClick={() => toggleModule(idx, mi)}
                      className={`syl-chunk ${(syllabusState[idx] || [])[mi] ? 'active' : ''}`}
                      sx={{ cursor: isTeacher ? 'pointer' : 'default', '&:active': isTeacher ? { transform: 'scale(0.98)' } : {} }}
                      title={isTeacher ? `Toggle ${m.label}` : ''}
                    />
                  ))}
                </Box>
                <Typography className="syl-meta">{completedLive}/{total} modules done ({percentLive}%)</Typography>
              </Paper>
            </Grid>
            );
          })}
        </Grid>
        {/* screenshots removed */}
      </Box>

      <Box className="student-portal-right">
        <Paper className="sp-card">
          <Typography variant="h6">Quick Actions</Typography>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Button variant="outlined">Download Gazette</Button>
            <Button variant="outlined">Messages</Button>
            <Button variant="outlined">Settings</Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
