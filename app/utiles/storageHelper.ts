export const getStorageKey = (key: string) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        // যদি লগইন থাকে, তাহলে 'cart_email' রিটার্ন করবে
        return `${key}_${userData.email}`; 
      } catch (e) {
        return key;
      }
    }
  }
  // লগইন না থাকলে শুধুই 'cart' রিটার্ন করবে
  return key; 
};