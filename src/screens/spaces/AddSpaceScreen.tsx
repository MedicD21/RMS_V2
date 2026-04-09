import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpacesStore } from "@/store/spacesStore";
import type { RoomType } from "@/types";
import { ROOM_TYPE_LABELS } from "@/types";
import {
  MdBedroomChild,
  MdKitchen,
  MdLiving,
  MdBathroom,
  MdGarage,
  MdCreate,
} from "react-icons/md";
import { GiOfficeChair } from "react-icons/gi";
import { FaBoxOpen } from "react-icons/fa";

const ROOM_TYPES = Object.entries(ROOM_TYPE_LABELS) as [RoomType, string][];

const ROOM_ICONS: Record<RoomType, React.ReactNode> = {
  bedroom: <MdBedroomChild />,
  kitchen: <MdKitchen />,
  living_room: <MdLiving />,
  office: <GiOfficeChair />,
  bathroom: <MdBathroom />,
  garage: <MdGarage />,
  other: <FaBoxOpen />,
};

const CREATE_ICON: Record<string, React.ReactNode> = {
  create: <MdCreate />,
};

export function AddSpaceScreen() {
  const navigate = useNavigate();
  const { addSpace } = useSpacesStore();
  const [name, setName] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("bedroom");

  async function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;

    const space = {
      id: crypto.randomUUID(),
      name: trimmed,
      roomType,
      createdAt: new Date().toISOString(),
      scans: [],
    };

    await addSpace(space);
    navigate(`/spaces/${space.id}`, { replace: true });
  }

  return (
    <div className='flex flex-col h-full' style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div
        className='flex items-center gap-3 translate-y-3 px-5'
        style={{
          paddingTop: `calc(env(safe-area-inset-top) + 30px)`,
          paddingBottom: `calc(env(safe-area-inset-bottom) + 30px)`,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className='w-9 h-9 flex items-center justify-center rounded-xl active:opacity-60'
          style={{ background: "var(--surface)" }}
          aria-label='Back'
        >
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
            <path
              d='M15 18l-6-6 6-6'
              stroke='var(--text-primary)'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
        <h1
          className='text-3xl font-bold'
          style={{ color: "var(--text-primary)" }}
        >
          New Space
        </h1>
      </div>

      <div className='scroll-area flex-1 px-5 pb-8'>
        {/* Name input */}
        <div className='mb-6'>
          <label
            className='block text-sm font-semibold mb-2'
            style={{ color: "var(--text-secondary)" }}
          >
            Space Name
          </label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g. Master Bedroom, Home Office…'
            maxLength={40}
            className='w-full px-4 py-3.5 rounded-2xl text-base font-medium outline-none transition-all'
            style={{
              background: "var(--surface)",
              color: "var(--text-primary)",
              border: "1.5px solid var(--border)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Room type picker */}
        <div className='mb-8'>
          <label
            className='block text-md font-semibold mb-3'
            style={{ color: "var(--text-secondary)" }}
          >
            Room Type
          </label>
          <div className='grid grid-cols-2 gap-2.5'>
            {ROOM_TYPES.map(([type, label]) => {
              const active = roomType === type;
              return (
                <button
                  key={type}
                  onClick={() => setRoomType(type)}
                  className='flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all active:opacity-70 active:shadow-xl active:shadow-accent/30'
                  style={{
                    background: active
                      ? "var(--accent-hover)"
                      : "var(--surface)",
                    border: `1.5px solid ${active ? "var(--tab-bar-bg)" : "var(--border)"}`,
                    color: active
                      ? "var(--text-secondary)"
                      : "var(--text-primary)",
                    transform: active ? "scale(1.05)" : "none",
                  }}
                >
                  <span className='text-xl'>{ROOM_ICONS[type]}</span>
                  <span
                    className='text-sm font-semibold'
                    style={{
                      color: active
                        ? "var(--text-secondary)"
                        : "var(--text-primary)",
                    }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className='px-5 pb-6 mb-4 safe-bottom'>
        <button
          onClick={handleCreate}
          disabled={!name.trim()}
          className='w-full text-xl py-6 rounded-2xl font-bold transition-opacity active:opacity-70'
          style={{
            background: name.trim() ? "var(--accent)" : "var(--border)",
            color: name.trim() ? "#000" : "var(--text-muted)",
          }}
        >
          <span className='flex items-center justify-center gap-2'>
            {CREATE_ICON.create}
            Create Space
          </span>
        </button>
      </div>
    </div>
  );
}
