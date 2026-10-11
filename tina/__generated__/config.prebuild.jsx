// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "master";
var config_default = defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "media",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "site",
        label: "Site",
        path: "content",
        format: "json",
        ui: {
          global: true,
          allowedActions: {
            create: false,
            delete: false
          },
          router: () => "/"
        },
        match: {
          include: "site"
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            required: true
          },
          {
            type: "string",
            name: "title",
            label: "Site title",
            required: true
          },
          {
            type: "string",
            name: "description",
            label: "Meta description",
            ui: { component: "textarea" }
          },
          {
            type: "string",
            name: "email",
            label: "Email"
          },
          {
            type: "object",
            name: "socials",
            label: "Social links",
            list: true,
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "href", label: "URL" }
            ]
          },
          {
            type: "object",
            name: "nav",
            label: "Navigation",
            list: true,
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "href", label: "Href" }
            ]
          },
          {
            type: "object",
            name: "about",
            label: "About",
            fields: [
              { type: "string", name: "headline", label: "Headline" },
              {
                type: "string",
                name: "body",
                label: "Body",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "extended",
                label: "Extended",
                ui: { component: "textarea" }
              }
            ]
          },
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              {
                type: "string",
                name: "intro",
                label: "Intro",
                ui: { component: "textarea" }
              }
            ]
          }
        ]
      },
      {
        name: "caseStudy",
        label: "Case Studies",
        path: "content/case-studies",
        format: "json",
        match: {
          include: "*",
          exclude: "{_schema,index}"
        },
        ui: {
          filename: {
            readonly: true
          },
          router: ({ document }) => `/work/${document._sys.filename}`
        },
        fields: [
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true
          },
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: ["digital", "physical"],
            required: true
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            ui: { component: "textarea" },
            required: true
          },
          {
            type: "string",
            name: "role",
            label: "Role"
          },
          {
            type: "string",
            name: "duration",
            label: "Timeline"
          },
          {
            type: "string",
            name: "team",
            label: "Team",
            ui: { component: "textarea" }
          },
          {
            type: "string",
            name: "tools",
            label: "Tools",
            list: true
          },
          {
            type: "object",
            name: "cover",
            label: "Cover",
            fields: [
              { type: "string", name: "src", label: "Image path" },
              { type: "string", name: "alt", label: "Alt text" },
              { type: "string", name: "aspectRatio", label: "Aspect ratio" }
            ]
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured"
          },
          {
            type: "string",
            name: "brand",
            label: "Brand theme",
            options: ["kitchens-for-good", "current", "autumn-moon"]
          },
          {
            type: "object",
            name: "stats",
            label: "Stats",
            list: true,
            fields: [
              { type: "string", name: "value", label: "Value" },
              { type: "string", name: "label", label: "Label" }
            ]
          },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            fields: [
              { type: "string", name: "id", label: "Section ID", required: true },
              {
                type: "string",
                name: "title",
                label: "Section title",
                required: true
              },
              {
                type: "object",
                name: "blocks",
                label: "Blocks",
                list: true,
                fields: [
                  {
                    type: "string",
                    name: "type",
                    label: "Block type",
                    options: [
                      "richText",
                      "callout",
                      "quote",
                      "stats",
                      "image",
                      "imageGallery",
                      "video",
                      "twoColumn",
                      "comparison",
                      "custom"
                    ],
                    required: true
                  },
                  {
                    type: "string",
                    name: "content",
                    label: "Content / callout",
                    ui: { component: "textarea" }
                  },
                  {
                    type: "string",
                    name: "text",
                    label: "Quote text",
                    ui: { component: "textarea" }
                  },
                  {
                    type: "string",
                    name: "attribution",
                    label: "Quote attribution"
                  },
                  { type: "string", name: "src", label: "Image src" },
                  { type: "string", name: "alt", label: "Image alt" },
                  {
                    type: "string",
                    name: "aspectRatio",
                    label: "Aspect ratio"
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Stat items",
                    list: true,
                    fields: [
                      { type: "string", name: "value", label: "Value" },
                      { type: "string", name: "label", label: "Label" }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
