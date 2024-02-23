export function truncateText(text) {
    const limit = 200;
    return text && text.length > limit ? `${text.substring(0, limit)}...See more` : text;
}

export  const checkWindowSize = () => {
    if (window.innerWidth >  768) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  };