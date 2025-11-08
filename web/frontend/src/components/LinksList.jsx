import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useLinks } from "../hooks";
import { LinkItem } from "../components";

export const LinksList = ({ linksData = [] }) => {
  const { reorderLinks, isReorderingLinks } = useLinks();

  const onDragEnd = async (dragEvent) => {
    const { active, over } = dragEvent;
    if (!over || active.id === over.id) return;

    const oldIndex = linksData.findIndex((l) => l.uuid === active.id);
    const newIndex = linksData.findIndex((l) => l.uuid === over.id);
    /*
    arrayMove will return the reordered array, map will update the position value
    */
    const reorderedLinks = arrayMove(linksData, oldIndex, newIndex).map(
      (link, i) => ({
        ...link,
        position: i,
      })
    );
    reorderLinks(reorderedLinks);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={linksData.map((link) => link.uuid)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="relative flex flex-col gap-2 overflow-y-auto hide-scrollbar">
          {isReorderingLinks && (
            <div className="absolute top-0 left-0 w-full h-[200%] bg-gray-50/50" />
          )}
          {linksData.map((link, i) => (
            <LinkItem key={link.uuid} linkItem={link} linkNumber={i + 1} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};
