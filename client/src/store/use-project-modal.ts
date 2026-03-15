import { create } from 'zustand';

interface ProjectModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useProjectModal = create<ProjectModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  setIsOpen: (isOpen) => set({ isOpen }),
}));
