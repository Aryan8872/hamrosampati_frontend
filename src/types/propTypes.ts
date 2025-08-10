import { ReactElement } from "react";

// Property Types
export type PropertyStatus = 'occupied' | 'vacant' | 'pending' | 'maintenance';

export type Property = {
  id: number;
  name: string;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  location: string;
  type: string;
  price: number;
  status: PropertyStatus;
};

// Booking Types
export type Booking = {
  id: number;
  property: string;
  image: string;
  tenant: string;
  date: string;
  price: number;
  status: PropertyStatus;
};

// UI Component Types
export type StatusBadgeProps = {
  status: PropertyStatus;
};

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  color: string;
  icon: ReactElement;
};

export type NavItem = {
  icon: ReactElement;
  text: string;
  path?: string;
};

export type ButtonProps = {
  children: ReactElement;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactElement;
  className?: string;
  onClick?: () => void;
};

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
};

export type ConfimationModalType = "DELETE" | "UPDATE" | "WARNING"

export type ConfirmationModalProps = {
  onOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  dataId?: string,
  actionTrigger?: () => void,
  modalType?: ConfimationModalType,
  actionCancel?: () => void,
  messageData?: string,
  dataPayload?: Record<string, unknown>
  confirmText?: string;
  cancelText?: string;
};

