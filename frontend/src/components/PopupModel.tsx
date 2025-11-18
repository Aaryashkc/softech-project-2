import { useEffect, useState } from "react";
import { usePopupStore, type PopupType } from "../stores/usePopupStore";

const PopupModal = () => {
  const { popups, fetchPopups } = usePopupStore();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);

  // Fetch popups on mount
  useEffect(() => {
    console.log("Fetching popups...");
    fetchPopups();
  }, [fetchPopups]);

  // Show once per browser session (resets when browser closes)
  useEffect(() => {
    console.log("Popups loaded:", popups.length);
    if (popups.length === 0) return;

    const seen = sessionStorage.getItem("popup_shown");
    console.log("Session storage check:", seen);
    
    if (!seen) {
      console.log("Showing popup!");
      setShow(true);
      sessionStorage.setItem("popup_shown", "true");
    } else {
      console.log("Popup already shown this session");
    }
  }, [popups]);

  console.log("Show state:", show, "Popups count:", popups.length);

  if (!show || popups.length === 0) return null;

  const popup: PopupType = popups[currentIndex];

  const handleClose = () => {
    if (currentIndex < popups.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShow(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999] animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4 relative animate-scaleIn">
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl z-10"
        >
          ✕
        </button>

        {/* Image - Full image shown in compact size */}
        {popup.image && (
          <img
            src={popup.image}
            alt="Popup"
            className="w-full h-auto rounded-lg mb-5"
          />
        )}

        {/* Title */}
        <h2 className="text-2xl font-bold mb-3">{popup.title}</h2>

        {/* Message */}
        {popup.message && (
          <p className="text-gray-700 text-base leading-relaxed">{popup.message}</p>
        )}

        {/* Button */}
        <button
          onClick={handleClose}
          className="mt-6 w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-800 font-medium text-base"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PopupModal;