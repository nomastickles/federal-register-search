import "./App.css";
import React from "react";
import { Plus } from "react-feather";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import Masthead from "./Nav";
import { TopicComponent } from "./Topic/TopicComponent";
import { TopicOpenLayer } from "./Topic/TopicOpenLayer";
import { actions } from "./slice";
import { Step } from "./types";
import { useAppState } from "./hooks/useAppState";
import { useDispatch } from "./hooks/useDispatch";

function App() {
  const dispatch = useDispatch();
  const { topics, stepMap } = useAppState();
  const currentTopicId = stepMap[Step.TOPIC_OPEN];
  const openTopic = topics.find((t) => t.id === currentTopicId);

  React.useEffect(() => {
    dispatch(actions.init());
  }, [dispatch]);

  // sync the browser tab title with the open topic (or app name at home)
  React.useEffect(() => {
    const base = "Federal Register Search";
    if (openTopic && openTopic.searchWords.length > 0) {
      document.title = `${openTopic.searchWords.join(" · ")} — ${base}`;
    } else {
      document.title = base;
    }
    return () => {
      document.title = base;
    };
  }, [openTopic]);

  const onOpen = React.useCallback(
    (id: number) => {
      dispatch(actions.setStepValue({ step: Step.TOPIC_OPEN, value: id }));
    },
    [dispatch]
  );

  const onAddTopic = React.useCallback(() => {
    dispatch(actions.addTopic());
  }, [dispatch]);

  // dnd-kit sensors — keep mouse and touch separate so they don't fight
  // for the same events (PointerSensor sees touch as a pointer event and
  // beats TouchSensor's delay activation, which kills mobile drag).
  // - MouseSensor: small movement before activating, so clicks still fire.
  // - TouchSensor: long-press hold (220ms) before activating, so taps still
  //   open the topic and finger-scrolling still scrolls the list.
  // - KeyboardSensor: arrow-key reorder for accessibility.
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 220, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const ids = topics.map((t) => t.id);
      const oldIndex = ids.indexOf(active.id as number);
      const newIndex = ids.indexOf(over.id as number);
      if (oldIndex < 0 || newIndex < 0) return;
      const next = arrayMove(ids, oldIndex, newIndex);
      dispatch(actions.reorderTopics(next));
    },
    [topics, dispatch]
  );

  const topicIds = React.useMemo(() => topics.map((t) => t.id), [topics]);

  return (
    <div className="container">
      <Masthead />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={topicIds} strategy={verticalListSortingStrategy}>
          <div className="topic-list">
            {topics.map((topic) => (
              <TopicComponent
                key={topic.id}
                topic={topic}
                onOpen={() => onOpen(topic.id)}
              />
            ))}

            <button className="topic-add" onClick={onAddTopic} type="button">
              <Plus size={16} /> add topic
            </button>
          </div>
        </SortableContext>
      </DndContext>

      {openTopic && <TopicOpenLayer topic={openTopic} />}
    </div>
  );
}

export default App;
