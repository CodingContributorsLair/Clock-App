import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import {
  Calendar,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle,
  Circle,
  Briefcase,
  Home,
  Tag,
  Clock,
  AlertCircle,
  Check,
  X,
  Filter,
  CalendarDays,
} from 'lucide-react';

// Color mapping for categories using Tailwind classes
const categoryColors = {
  Work: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  Personal: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  Other: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
};

const categoryIcons = {
  Work: <Briefcase size={16} className="shrink-0" />,
  Personal: <Home size={16} className="shrink-0" />,
  Other: <Tag size={16} className="shrink-0" />,
};

const statusIcons = {
  done: <CheckCircle size={16} className="text-green-500" />,
  passed: <Clock size={16} className="text-gray-400" />,
  soon: <AlertCircle size={16} className="text-red-500" />,
  soonMinutes: <AlertCircle size={16} className="text-orange-500" />,
  upcoming: <CalendarDays size={16} className="text-blue-400" />,
};

export const CalendarCard = ({ events, setEvents, now }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEventName, setNewEventName] = useState('');
  const [newEventTime, setNewEventTime] = useState('12:00');
  const [newEventDate, setNewEventDate] = useState(now.toISOString().split('T')[0]);
  const [newEventCategory, setNewEventCategory] = useState('Work');
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);

  const today = now.toISOString().split('T')[0];
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Filter events by search and category
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, filterCategory]);

  // Group filtered events
  const todaysEvents = useMemo(
    () => filteredEvents.filter(e => e.date === today).sort((a, b) => a.time.localeCompare(b.time)),
    [filteredEvents, today]
  );
  const tomorrowsEvents = useMemo(
    () => filteredEvents.filter(e => e.date === tomorrowStr).sort((a, b) => a.time.localeCompare(b.time)),
    [filteredEvents, tomorrowStr]
  );
  const upcomingEvents = useMemo(
    () =>
      filteredEvents
        .filter(e => e.date > tomorrowStr)
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    [filteredEvents, tomorrowStr]
  );

  // Mini calendar: get dates with events
  const eventDates = useMemo(() => {
    const dates = {};
    events.forEach(e => {
      dates[e.date] = (dates[e.date] || 0) + 1;
    });
    return dates;
  }, [events]);

  const addOrUpdateEvent = () => {
    if (!newEventName.trim()) return;
    const newEvent = {
      name: newEventName,
      time: newEventTime,
      date: newEventDate,
      category: newEventCategory,
      completed: false,
    };
    if (editingEvent !== null) {
      const updatedEvents = [...events];
      updatedEvents[editingEvent.index] = { ...updatedEvents[editingEvent.index], ...newEvent };
      setEvents(updatedEvents);
    } else {
      setEvents([...events, newEvent]);
    }
    resetModal();
  };

  const deleteEvent = (index) => {
    if (window.confirm('Delete this event?')) {
      const updated = events.filter((_, i) => i !== index);
      setEvents(updated);
    }
  };

  const toggleComplete = (index) => {
    const updated = [...events];
    updated[index].completed = !updated[index].completed;
    setEvents(updated);
  };

  const editEvent = (event, index) => {
    setEditingEvent({ index, ...event });
    setNewEventName(event.name);
    setNewEventTime(event.time);
    setNewEventDate(event.date);
    setNewEventCategory(event.category || 'Other');
    setModalOpen(true);
  };

  const resetModal = () => {
    setModalOpen(false);
    setEditingEvent(null);
    setNewEventName('');
    setNewEventTime('12:00');
    setNewEventDate(today);
    setNewEventCategory('Work');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
  };

  const getStatus = (eventDate, eventTime, completed) => {
    if (completed) return { text: 'Done', icon: statusIcons.done };
    const [h, m] = eventTime.split(':').map(Number);
    const eventDateTime = new Date(eventDate);
    eventDateTime.setHours(h, m, 0);
    const diffMin = (eventDateTime - now) / 60000;
    if (diffMin < 0) return { text: 'Passed', icon: statusIcons.passed };
    if (diffMin < 15) return { text: 'Soon!', icon: statusIcons.soon };
    if (diffMin < 60) return { text: `In ${Math.floor(diffMin)}m`, icon: statusIcons.soonMinutes };
    if (diffMin < 1440) return { text: `In ${Math.floor(diffMin / 60)}h`, icon: statusIcons.soonMinutes };
    return { text: new Date(eventDate).toLocaleDateString(), icon: statusIcons.upcoming };
  };

  const renderEventList = (eventsList, showDate = false) => {
    if (eventsList.length === 0) return <div className="text-sm opacity-70 py-2">No events</div>;
    return eventsList.map((ev, idx) => {
      const status = getStatus(ev.date, ev.time, ev.completed);
      const originalIndex = events.findIndex(e => 
        e.date === ev.date && e.time === ev.time && e.name === ev.name && e.category === ev.category
      );
      return (
        <div
          key={`${ev.date}-${ev.time}-${ev.name}-${idx}`}
          className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm border transition-all hover:shadow-md ${
            categoryColors[ev.category] || categoryColors.Other
          } ${ev.completed ? 'opacity-60 line-through' : ''}`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={() => toggleComplete(originalIndex)}
              className="shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
              aria-label={ev.completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {ev.completed ? (
                <CheckCircle size={18} className="text-green-500" />
              ) : (
                <Circle size={18} className="text-gray-400 hover:text-gray-300" />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium truncate">{ev.name}</span>
                <span className="shrink-0">{categoryIcons[ev.category]}</span>
                {showDate && (
                  <span className="text-xs opacity-70 bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">
                    {ev.date}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs opacity-80 mt-0.5">
                <span>{ev.time}</span>
                <span className="flex items-center gap-1">
                  {status.icon}
                  {status.text}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-1 ml-2 shrink-0">
            <button
              onClick={() => editEvent(ev, originalIndex)}
              className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition"
              aria-label="Edit event"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => deleteEvent(originalIndex)}
              className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition text-red-500"
              aria-label="Delete event"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      );
    });
  };

  // Mini calendar: generate days of current month
  const renderMiniCalendar = () => {
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0 = Sunday

    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: dateStr, count: eventDates[dateStr] || 0 });
    }

    return (
      <div className="grid grid-cols-7 gap-1 text-xs mt-3">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center font-medium opacity-70">{day}</div>
        ))}
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`relative text-center p-1 rounded ${
              day?.date === today
                ? 'bg-blue-500 text-white font-bold'
                : day?.date
                ? 'hover:bg-black/10 dark:hover:bg-white/10'
                : ''
            }`}
          >
            {day ? day.date.split('-')[2] : ''}
            {day?.count > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" title={`${day.count} event(s)`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Card title="Calendar" icon={<Calendar className="w-5 h-5" />}>
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all" className="text-black bg-white">All</option>
              <option value="Work" className="text-black bg-white">Work</option>
              <option value="Personal" className="text-black bg-white">Personal</option>
              <option value="Other" className="text-black bg-white">Other</option>
            </select>
            {(searchTerm || filterCategory !== 'all') && (
              <button
                onClick={clearFilters}
                className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition"
                aria-label="Clear filters"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Mini Calendar Toggle */}
        <button
          onClick={() => setShowMiniCalendar(!showMiniCalendar)}
          className="flex items-center gap-1 text-sm opacity-70 hover:opacity-100 mb-3 transition"
        >
          <CalendarDays size={14} />
          {showMiniCalendar ? 'Hide' : 'Show'} mini calendar
          {showMiniCalendar ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showMiniCalendar && renderMiniCalendar()}

        {/* Today */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <span>📅 Today</span>
            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded-full">
              {todaysEvents.length}
            </span>
          </h4>
          {renderEventList(todaysEvents)}
        </div>

        {/* Tomorrow */}
        {tomorrowsEvents.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <span>📆 Tomorrow</span>
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded-full">
                {tomorrowsEvents.length}
              </span>
            </h4>
            {renderEventList(tomorrowsEvents)}
          </div>
        )}

        {/* Upcoming */}
        {upcomingEvents.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <span>📌 Upcoming</span>
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded-full">
                {upcomingEvents.length}
              </span>
              {upcomingEvents.length > 5 && (
                <button
                  onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                  className="text-xs opacity-70 hover:opacity-100 flex items-center gap-1 ml-auto transition"
                >
                  {showAllUpcoming ? 'Show less' : `+${upcomingEvents.length - 5} more`}
                  {showAllUpcoming ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              )}
            </h4>
            {renderEventList(showAllUpcoming ? upcomingEvents : upcomingEvents.slice(0, 5), true)}
          </div>
        )}

        {/* Add Event Button */}
        <Button
          onClick={() => {
            resetModal();
            setModalOpen(true);
          }}
          className="mt-2 w-full"
        >
          + Add Event
        </Button>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={resetModal}
        title={editingEvent ? 'Edit Event' : 'Add Event'}
        onSave={addOrUpdateEvent}
      >
        <Input
          type="text"
          placeholder="Event name"
          value={newEventName}
          onChange={(e) => setNewEventName(e.target.value)}
          className="mb-3"
        />
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Input
            type="date"
            value={newEventDate}
            onChange={(e) => setNewEventDate(e.target.value)}
            min={today}
          />
          <Input
            type="time"
            value={newEventTime}
            onChange={(e) => setNewEventTime(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={newEventCategory}
            onChange={(e) => setNewEventCategory(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Work" className="text-black bg-white">Work</option>
            <option value="Personal" className="text-black bg-white">Personal</option>
            <option value="Other" className="text-black bg-white">Other</option>
          </select>
        </div>
      </Modal>
    </>
  );
};