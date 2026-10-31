"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { eventsPageDefaults, membershipPageDefaults } from "./lib/membership-page-defaults";
import {disableNoopPublish} from "./sanity/document-actions";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: 'sitePageWithRoute',
        title: 'Website page',
        schemaType: 'sitePage',
        value: (params: {route: string; title: string}) => {
          const routeDefaults = params.route === '/membership'
            ? membershipPageDefaults
            : params.route === '/events'
              ? eventsPageDefaults
              : {}
          return {
            ...routeDefaults,
            route: params.route,
            title: params.title,
          }
        },
      },
    ],
  },
  plugins: [
    structureTool({ structure }),
  ],
  // Vision and the duplicate management tables are intentionally omitted from
  // the editor navigation. Everyday editing and spreadsheet import now live
  // under Structure, where content is organized by task.
  document: {
    actions: (prev, context) => {
      const pageActions = context.schemaType === 'sitePage'
        ? prev.filter((action) => action.action !== 'delete' && action.action !== 'duplicate')
        : prev
      return pageActions.map((action) =>
        action.action === 'publish' ? disableNoopPublish(action) : action
      )
    },
  },
});
