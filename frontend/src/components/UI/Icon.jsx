import React from "react";
import { FaUser, FaWhatsapp, FaSms, FaInfoCircle } from "react-icons/fa";

export default function Icon({ name = "info", className = "" }) {
  const map = { user: FaUser, whatsapp: FaWhatsapp, sms: FaSms, info: FaInfoCircle };
  const Comp = map[name] || FaInfoCircle;
  return <Comp className={className} />;
}
