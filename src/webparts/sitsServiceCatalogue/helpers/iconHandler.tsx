export default function iconHandler(category) {
    const iconMap = {
      "Application Services": "WebAppBuilderFragment",
      "Cloud & Infrastructure Services": "Cloud",
      "Cybersecurity Services Category": "Shield",
      "License management Services": "PublicContactCard",
      "Additional Services": "AddToShoppingList"
      // Add more categories and their respective icons here
    };
  
    return iconMap[category] || "Library";
   }