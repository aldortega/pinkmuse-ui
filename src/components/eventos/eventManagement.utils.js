export const getEventKey = (event) =>
  event?._id ?? event?.id ?? event?.nombreEvento ?? event?.slug ?? null;

export const parseEventDate = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const sortEventsAscending = (a, b) => {
  const dateA = parseEventDate(a?.fecha);
  const dateB = parseEventDate(b?.fecha);

  if (!dateA && !dateB) {
    return 0;
  }

  if (!dateA) {
    return 1;
  }

  if (!dateB) {
    return -1;
  }

  return dateA.getTime() - dateB.getTime();
};

export const splitEventsByDate = (events = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = [];
  const pastEvents = [];

  events.forEach((event) => {
    const eventDate = parseEventDate(event?.fecha);
    if (eventDate && eventDate < today) {
      pastEvents.push(event);
    } else {
      upcomingEvents.push(event);
    }
  });

  return {
    upcomingEvents: [...upcomingEvents].sort(sortEventsAscending),
    pastEvents: [...pastEvents].sort((a, b) => -sortEventsAscending(a, b)),
  };
};
