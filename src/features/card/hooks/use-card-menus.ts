"use client";

import { useRef, useState, useCallback } from "react";

export function useCardMenus() {
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const inviteBtnRef = useRef<HTMLButtonElement>(null);
  const dateBtnRef = useRef<HTMLDivElement>(null);
  const labelBtnRef = useRef<HTMLButtonElement>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const addMenu = useCallback(() => {
    setShowMenu((p) => !p);
    setShowDatePicker(false);
  }, []);

  const handleOpenDates = () => {
    setShowMenu(false);
    setShowDatePicker(true);
  };

  const handleOpenLabels = () => {
    setShowMenu(false);
    setShowLabels(true);
  };

  const handleOpenInvites = () => {
    setShowMenu(false);
    setShowInvite(true);
  };

  return {
    addBtnRef,
    inviteBtnRef,
    dateBtnRef,
    labelBtnRef,

    showMenu,
    showDatePicker,
    showLabels,
    showInvite,

    addMenu,
    handleOpenDates,
    handleOpenLabels,
    handleOpenInvites,

    setShowDatePicker,
    setShowLabels,
    setShowInvite,
  };
}