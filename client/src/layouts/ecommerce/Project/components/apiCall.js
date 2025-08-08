import { useState } from 'react';
import { getAllProjects, getFeature, getProductOwner, getTicketById } from '../../../../config/Services';

export const fetchProjectData = async (pageNumber, searchQuery) => {
  const payload = {
    pageNumber: pageNumber - 1,
    pageSize: 10,
    sortOrder: 'ASCENDING',
    sortBy: 'created',
    search: searchQuery,
  };
  const projectsResponse = await getAllProjects(payload);
  const projectsOption = projectsResponse?.data?.data?.project?.map((projectVal) => ({
    value: projectVal?.projectId,
    label: projectVal?.projectName,
  }));
  return projectsOption;
};

export const fetchFeatureData = async (projectId, pageNumber, searchQuery) => {
  const payload = {
    pageNumber: pageNumber - 1,
    pageSize: 20,
    sortOrder: 'ASCENDING',
    sortBy: 'created',
    search: searchQuery,
  };
  const response = await getFeature(projectId, payload);
  const fetureOption = response?.data?.data?.data?.map((projectVal) => ({
    value: projectVal?.featureId,
    label: projectVal?.featureName,
  }));
  return fetureOption;
};

export const fetchTicketById = async (taskId) => {
  try {
    const response = await getTicketById(taskId);
    return response;
  } catch (err) {
    console.log('Something went wrong', err);
  }
};

const org_Id = localStorage.getItem('orgId');
const source_location_Id = localStorage.getItem('locId');
export const fetchAssignee = async () => {
  const payload = {
    orgId: org_Id,
    contextId: source_location_Id,
  };
  const response = await getProductOwner(payload);
  const users = response?.data?.data?.map((user) => ({
    value: user.uidx,
    label: `${user?.firstName} ${user?.secondName}`,
  }));
  return users;
};
