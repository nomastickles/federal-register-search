import "./App.css";
import React from "react";
import { Plus } from "react-feather";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
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

  const onOpen = React.useCallback(
    (id: number) => {
      dispatch(actions.setStepValue({ step: Step.TOPIC_OPEN, value: id }));
    },
    [dispatch]
  );

  const onAddTopic = React.useCallback(() => {
    dispatch(actions.addTopic());
  }, [dispatch]);

  // dnd-kit sensors:
  // - PointerSensor (mouse/trackpad): require small drag movement before
  //   activating so a normal click still fires a click event on the card.
  // - TouchSensor (mobile): require a 220ms hold-still long-press before
  //   dragging, so a quick tap opens the topic and a hold drags it.
  // - KeyboardSensor: arrow-key reorder for accessibility.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 220, tolerance: 6 },
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
