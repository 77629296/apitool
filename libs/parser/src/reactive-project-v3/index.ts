import { v4 as uuidv4 } from 'uuid';
import {
  defaultAward,
  defaultCertification,
  defaultEducation,
  defaultExperience,
  defaultInterest,
  defaultLanguage,
  defaultProfile,
  defaultProject,
  defaultPublication,
  defaultReference,
  defaultProjectData,
  defaultSkill,
  defaultVolunteer,
  ProjectData,
} from "@apitool/schema";
import { isUrl, Json } from "@apitool/utils";
import { Schema } from "zod";

import { Parser } from "../interfaces/parser";
import { ReactiveProjectV3, reactiveProjectV3Schema } from "./schema";

export * from "./schema";

export class ReactiveProjectV3Parser implements Parser<Json, ReactiveProjectV3> {
  schema: Schema;

  constructor() {
    this.schema = reactiveProjectV3Schema;
  }

  readFile(file: File): Promise<Json> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const result = JSON.parse(reader.result as string) as Json;
          resolve(result);
        } catch (error) {
          reject(new Error("Failed to parse JSON"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read the file"));
      };

      reader.readAsText(file);
    });
  }

  validate(data: Json) {
    return this.schema.parse(data) as ReactiveProjectV3;
  }

  convert(data: ReactiveProjectV3) {
    const result = JSON.parse(JSON.stringify(defaultProjectData)) as ProjectData;

    // Basics
    result.basics.name = data.basics.name ?? "";
    result.basics.email = data.basics.email;
    result.basics.phone = data.basics.phone ?? "";
    result.basics.headline = data.basics.headline ?? "";
    result.basics.location = data.basics.location.address ?? "";
    result.sections.summary.content =
      (typeof data.basics.summary === "string" ? data.basics.summary : data.basics.summary?.body) ??
      "";
    result.basics.picture.url = isUrl(data.basics.photo.url) ? data.basics.photo.url! : "";

    // Profiles
    if (data.basics.profiles) {
      for (const profile of data.basics.profiles) {
        result.sections.profiles.items.push({
          ...defaultProfile,
          id: uuidv4(),
          network: profile.network ?? "",
          username: profile.username ?? "",
          icon: (profile.network ?? "").toLocaleLowerCase(),
          url: { ...defaultProfile.url, href: isUrl(profile.url) ? profile.url! : "" },
        });
      }
    }

    // Work
    if (data.sections.work.items) {
      for (const work of data.sections.work.items) {
        if (!work) continue;

        result.sections.experience.items.push({
          ...defaultExperience,
          id: uuidv4(),
          company: work.name ?? "",
          position: work.position ?? "",
          summary: work.summary ?? "",
          date: `${work.date?.start} - ${work.date?.end}`,
          url: { ...defaultExperience.url, href: isUrl(work.url) ? work.url! : "" },
        });
      }
    }

    // Awards
    if (data.sections.awards.items) {
      for (const award of data.sections.awards.items) {
        if (!award) continue;

        result.sections.awards.items.push({
          ...defaultAward,
          id: uuidv4(),
          title: award.title ?? "",
          awarder: award.awarder ?? "",
          date: award.date ?? "",
          summary: award.summary ?? "",
          url: { ...defaultAward.url, href: isUrl(award.url) ? award.url! : "" },
        });
      }
    }

    // Skills
    if (data.sections.skills.items) {
      for (const skill of data.sections.skills.items) {
        if (!skill) continue;

        result.sections.skills.items.push({
          ...defaultSkill,
          id: uuidv4(),
          name: skill.name ?? "",
          level: Math.floor(skill.levelNum / 2),
          description: skill.level ?? "",
          keywords: Array.isArray(skill.keywords)
            ? (skill.keywords.filter(Boolean) as string[])
            : [],
        });
      }
    }

    // Projects
    if (data.sections.projects.items) {
      for (const project of data.sections.projects.items) {
        if (!project) continue;

        result.sections.projects.items.push({
          ...defaultProject,
          id: uuidv4(),
          name: project.name ?? "",
          summary: project.summary ?? "",
          description: project.description ?? "",
          date: `${project.date?.start} - ${project.date?.end}`,
          keywords: Array.isArray(project.keywords)
            ? (project.keywords.filter(Boolean) as string[])
            : [],
          url: { ...defaultProject.url, href: isUrl(project.url) ? project.url! : "" },
        });
      }
    }

    // Education
    if (data.sections.education.items) {
      for (const education of data.sections.education.items) {
        if (!education) continue;

        result.sections.education.items.push({
          ...defaultEducation,
          id: uuidv4(),
          institution: education.institution ?? "",
          studyType: education.degree ?? "",
          area: education.area ?? "",
          score: education.score ?? "",
          summary: education.summary ?? "",
          date: `${education.date?.start} - ${education.date?.end}`,
          url: { ...defaultEducation.url, href: isUrl(education.url) ? education.url! : "" },
        });
      }
    }

    // Interests
    if (data.sections.interests.items) {
      for (const interest of data.sections.interests.items) {
        if (!interest) continue;

        result.sections.interests.items.push({
          ...defaultInterest,
          id: uuidv4(),
          name: interest.name ?? "",
          keywords: Array.isArray(interest.keywords)
            ? (interest.keywords.filter(Boolean) as string[])
            : [],
        });
      }
    }

    // Languages
    if (data.sections.languages.items) {
      for (const language of data.sections.languages.items) {
        if (!language) continue;

        result.sections.languages.items.push({
          ...defaultLanguage,
          id: uuidv4(),
          name: language.name ?? "",
          description: language.level ?? "",
          level: Math.floor(language.levelNum / 2),
        });
      }
    }

    // Volunteer
    if (data.sections.volunteer.items) {
      for (const volunteer of data.sections.volunteer.items) {
        if (!volunteer) continue;

        result.sections.volunteer.items.push({
          ...defaultVolunteer,
          id: uuidv4(),
          organization: volunteer.organization ?? "",
          position: volunteer.position ?? "",
          summary: volunteer.summary ?? "",
          date: `${volunteer.date?.start} - ${volunteer.date?.end}`,
          url: { ...defaultVolunteer.url, href: isUrl(volunteer.url) ? volunteer.url! : "" },
        });
      }
    }

    // References
    if (data.sections.references.items) {
      for (const reference of data.sections.references.items) {
        if (!reference) continue;

        result.sections.references.items.push({
          ...defaultReference,
          id: uuidv4(),
          name: reference.name ?? "",
          summary: reference.summary ?? "",
          description: reference.relationship ?? "",
        });
      }
    }

    // Publications
    if (data.sections.publications.items) {
      for (const publication of data.sections.publications.items) {
        if (!publication) continue;

        result.sections.publications.items.push({
          ...defaultPublication,
          id: uuidv4(),
          name: publication.name ?? "",
          summary: publication.summary ?? "",
          date: publication.date ?? "",
          url: { ...defaultPublication.url, href: isUrl(publication.url) ? publication.url! : "" },
        });
      }
    }

    // Certifications
    if (data.sections.certifications.items) {
      for (const certification of data.sections.certifications.items) {
        if (!certification) continue;

        result.sections.certifications.items.push({
          ...defaultCertification,
          id: uuidv4(),
          name: certification.name ?? "",
          issuer: certification.issuer ?? "",
          summary: certification.summary ?? "",
          date: certification.date ?? "",
          url: {
            ...defaultCertification.url,
            href: isUrl(certification.url) ? certification.url! : "",
          },
        });
      }
    }

    return result;
  }
}
