import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Music, Plus } from "lucide-react";

import { EventCard } from "./EventCard";
import { getEventKey } from "./eventManagement.utils";

const TAB_CONFIG = {
  upcoming: {
    label: (count) => `Proximos (${count})`,
    icon: Calendar,
    triggerClassName: "gap-2 text-slate-800 data-[state=active]:bg-red-50",
    cardBackground: "bg-red-50",
    emptyState: {
      icon: Music,
      iconClassName: "h-12 w-12 text-slate-700 mx-auto mb-4",
      title: "No hay proximos eventos",
      description: "Crea tu primer evento.",
      descriptionClassName: "text-slate-700 mb-4 ",
      actionLabel: "Crear evento",
      actionClassName: "gap-2 bg-gradient-to-br from-rose-500 via-red-400 to-red-500 ",
      actionIcon: Plus,
    },
  },
  past: {
    label: (count) => `Pasados (${count})`,
    icon: Clock,
    triggerClassName: "gap-2 text-slate-800 data-[state=active]:bg-red-50",
    cardBackground: "bg-red-100",
    emptyState: {
      icon: Clock,
      iconClassName: "h-12 w-12 mx-auto mb-4 text-slate-700",
      title: "No hay eventos pasados",
      description: "Tu historial de eventos aparecera aqui.",
      descriptionClassName: "text-slate-700",
    },
  },
};

function EventTabContent({
  events,
  loading,
  cardBackground,
  emptyState,
  onOpenCreate,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  deletingKey,
}) {
  if (loading) {
    return (
      <Card className={`text-center py-12 ${cardBackground}`}>
        <CardContent>
          <p className="text-slate-700">Cargando eventos...</p>
        </CardContent>
      </Card>
    );
  }

  if (!events.length) {
    const EmptyIcon = emptyState.icon;
    const ActionIcon = emptyState.actionIcon;

    return (
      <Card className={`text-center py-12 ${cardBackground}`}>
        <CardContent>
          {EmptyIcon && (
            <EmptyIcon className={emptyState.iconClassName} />
          )}
          <h3 className="text-lg font-semibold mb-2 text-slate-800">
            {emptyState.title}
          </h3>
          {emptyState.description && (
            <p className={emptyState.descriptionClassName}>
              {emptyState.description}
            </p>
          )}
          {emptyState.actionLabel && onOpenCreate && (
            <Button
              onClick={onOpenCreate}
              className={emptyState.actionClassName}
            >
              {ActionIcon && <ActionIcon className="h-4 w-4" />}
              {emptyState.actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        const eventKey = getEventKey(event);
        return (
          <EventCard
            key={eventKey}
            event={event}
            onView={onViewEvent}
            onEdit={onEditEvent}
            onDelete={onDeleteEvent}
            isDeleting={deletingKey === eventKey}
          />
        );
      })}
    </div>
  );
}

export function EventCategoryTabs({
  upcomingEvents,
  pastEvents,
  loading,
  onOpenCreate,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  deletingKey,
}) {
  const tabs = [
    {
      value: "upcoming",
      events: upcomingEvents,
      config: TAB_CONFIG.upcoming,
    },
    {
      value: "past",
      events: pastEvents,
      config: TAB_CONFIG.past,
    },
  ];

  return (
    <Tabs defaultValue="upcoming" className="space-y-6 ">
      <TabsList className="grid w-full grid-cols-2 max-w-md bg-red-100  ">
        {tabs.map(({ value, config, events: tabEvents }) => {
          const TriggerIcon = config.icon;
          return (
            <TabsTrigger
              key={value}
              value={value}
              className={config.triggerClassName}
            >
              {TriggerIcon && <TriggerIcon className="h-4 w-4" />}
              {config.label(tabEvents.length)}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {tabs.map(({ value, events: tabEvents, config }) => (
        <TabsContent key={value} value={value} className="space-y-4">
          <EventTabContent
            events={tabEvents}
            loading={loading}
            cardBackground={config.cardBackground}
            emptyState={config.emptyState}
            onOpenCreate={value === "upcoming" ? onOpenCreate : undefined}
            onViewEvent={onViewEvent}
            onEditEvent={onEditEvent}
            onDeleteEvent={onDeleteEvent}
            deletingKey={deletingKey}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
