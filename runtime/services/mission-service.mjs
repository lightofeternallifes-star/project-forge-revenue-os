export function createMissionService(store) {
  return {
    list(user) { return store.missions.filter((mission) => user.role === 'SUPER_ADMIN' || mission.organizationId === user.organizationId); },
    get(user, id) { return this.list(user).find((mission) => mission.id === id) || null; },
    dashboard(user) { const missions = this.list(user); return { total: missions.length, pending: missions.filter((mission) => ['Created', 'Assigned'].includes(mission.state)).length, running: missions.filter((mission) => ['Executing', 'Running'].includes(mission.state)).length, completed: missions.filter((mission) => ['Completed', 'Archived'].includes(mission.state)).length, blocked: missions.filter((mission) => ['Waiting', 'Failed'].includes(mission.state)).length }; }
  };
}
