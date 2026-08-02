import announcement from "./announcement";
import event from "./event";
import testPassed from "./testPassed";
import coach from "./coach";
import boardMember from "./boardMember";
import page from "./page";
import siteSettings from "./siteSettings";
import navigation, { navItem, navChild } from "./navigation";
import heroSlide from "./heroSlide";
import faq from "./faq";
import membershipCategory from "./membershipCategory";

export const schemaTypes = [
  // Singletons
  siteSettings,
  navigation,
  // Nav object types (not standalone documents, but must be registered)
  navItem,
  navChild,
  // Content
  announcement,
  event,
  heroSlide,
  faq,
  membershipCategory,
  testPassed,
  coach,
  boardMember,
  page,
];
