import { workspacesRepository } from '../../repositories/workspaces.repository';
import { CreateWorkspaceDto, UpdateWorkspaceDto, InviteMemberDto, UpdateMemberDto } from './validation';
import { logger } from '../../utils/logger';

export class WorkspacesService {
  async create(ownerId: string, ownerEmail: string, ownerName: string | undefined, dto: CreateWorkspaceDto) {
    // Check slug uniqueness
    const existing = await workspacesRepository.findBySlug(dto.slug);
    if (existing) {
      throw new Error('Slug is already taken');
    }

    const workspace = await workspacesRepository.create({
      ...dto,
      ownerId,
    });

    // Add owner as member
    await workspacesRepository.addMember(workspace.id, ownerId, {
      email: ownerEmail,
      name: ownerName,
      role: 'owner',
      status: 'active',
    });

    logger.info(`Workspace created: ${workspace.id} by ${ownerId}`);
    return workspace;
  }

  async getById(workspaceId: string) {
    const workspace = await workspacesRepository.findById(workspaceId);
    if (!workspace) throw new Error('Workspace not found');
    return workspace;
  }

  async update(workspaceId: string, dto: UpdateWorkspaceDto) {
    const workspace = await workspacesRepository.update(workspaceId, dto);
    if (!workspace) throw new Error('Workspace not found');
    return workspace;
  }

  async delete(workspaceId: string) {
    const deleted = await workspacesRepository.delete(workspaceId);
    if (!deleted) throw new Error('Workspace not found');
    return { deleted: true };
  }

  async getMembers(workspaceId: string) {
    return workspacesRepository.getMembers(workspaceId);
  }

  async inviteMember(workspaceId: string, invitedBy: string, dto: InviteMemberDto) {
    const members = await workspacesRepository.getMembers(workspaceId);
    const alreadyMember = members.find((m) => m.email === dto.email);
    if (alreadyMember) throw new Error('User is already a member of this workspace');

    const member = await workspacesRepository.addMember(workspaceId, dto.email, {
      email: dto.email,
      role: dto.role,
      status: 'invited',
      invitedBy,
    });
    // TODO: send invitation email
    logger.info(`Member invited: ${dto.email} to workspace ${workspaceId}`);
    return member;
  }

  async updateMember(workspaceId: string, userId: string, dto: UpdateMemberDto) {
    const member = await workspacesRepository.updateMember(workspaceId, userId, { role: dto.role });
    if (!member) throw new Error('Member not found');
    return member;
  }

  async removeMember(workspaceId: string, userId: string, requesterId: string) {
    if (userId === requesterId) throw new Error('Cannot remove yourself from workspace');
    const removed = await workspacesRepository.removeMember(workspaceId, userId);
    if (!removed) throw new Error('Member not found');
    return { removed: true };
  }
}

export const workspacesService = new WorkspacesService();
