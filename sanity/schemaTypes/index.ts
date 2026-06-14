import announcement from "./announcement";
import event from "./event";
import testPassed from "./testPassed";
import coach from "./coach";
import boardMember from "./boardMember";
import page from "./page";
import siteSettings from "./siteSettings";
import heroSlide from "./heroSlide";
import faq from "./faq";
import membershipCategory from "./membershipCategory";

export const schemaTypes = [
  // Singleton
  siteSettings,
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
