import { rest, RestContext } from 'msw';
import { API_URL, API_ENDPOINTS } from '../utils/constants';
import { RequestHandler, RequestBody, CommentRequestBody, AttachmentRequestBody, ResponseResolver, SolicitationWithDetails, TechnicianWithDetails, CommentWithUser, AttachmentWithDetails, TestUser, TestTechnician, TestSolicitation, MockedRequestWithParams } from './types';
import { UserRole } from '../types/user';
import { SolicitationStatus } from '../types/solicitation';
import { TechnicianStatus } from '../types/technician';

const baseUrl = API_URL;

// Dados mockados
const mockUsers: TestUser[] = [
  {
    id: 1,
    name: 'Usuário Teste',
    email: 'usuario@teste.com',
    role: 'user' as UserRole,
    password: '123456',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Técnico Teste',
    email: 'tecnico@teste.com',
    role: 'technician' as UserRole,
    password: '123456',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Admin Teste',
    email: 'admin@teste.com',
    role: 'admin' as UserRole,
    password: '123456',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockTechnicians: TestTechnician[] = [
  {
    id: 1,
    name: 'Técnico Teste',
    email: 'tecnico@teste.com',
    specialty: 'Eletricista',
    status: 'available' as TechnicianStatus,
    phone: '(11) 99999-9999',
    address: 'Rua Teste, 123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 2,
  },
  {
    id: 2,
    name: 'Técnico Teste 2',
    email: 'tecnico2@teste.com',
    specialty: 'Encanador',
    status: 'busy' as TechnicianStatus,
    phone: '(11) 88888-8888',
    address: 'Rua Teste, 456',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 3,
  },
];

const mockSolicitations: TestSolicitation[] = [
  {
    id: 1,
    title: 'Solicitação Teste 1',
    description: 'Descrição da solicitação teste 1',
    status: 'pending' as SolicitationStatus,
    priority: 'high',
    category: 'Elétrica',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 1,
    technicianId: 1,
  },
  {
    id: 2,
    title: 'Solicitação Teste 2',
    description: 'Descrição da solicitação teste 2',
    status: 'in_progress' as SolicitationStatus,
    priority: 'medium',
    category: 'Hidráulica',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 1,
    technicianId: 2,
  },
];

const mockComments: CommentWithUser[] = [
  {
    id: 1,
    content: 'Comentário teste 1',
    createdAt: new Date().toISOString(),
    userId: 1,
    solicitationId: 1,
    user: {
      id: 1,
      name: 'Usuário Teste',
      email: 'usuario@teste.com',
    },
  },
  {
    id: 2,
    content: 'Comentário teste 2',
    createdAt: new Date().toISOString(),
    userId: 2,
    solicitationId: 1,
    user: {
      id: 2,
      name: 'Técnico Teste',
      email: 'tecnico@teste.com',
    },
  },
];

const mockAttachments: AttachmentWithDetails[] = [
  {
    id: 1,
    filename: 'teste1.pdf',
    url: 'http://example.com/teste1.pdf',
    createdAt: new Date().toISOString(),
    solicitationId: 1,
    userId: 1,
    user: {
      id: 1,
      name: 'Usuário Teste',
      email: 'usuario@teste.com',
    },
  },
  {
    id: 2,
    filename: 'teste2.jpg',
    url: 'http://example.com/teste2.jpg',
    createdAt: new Date().toISOString(),
    solicitationId: 1,
    userId: 2,
    user: {
      id: 2,
      name: 'Técnico Teste',
      email: 'tecnico@teste.com',
    },
  },
];

// Handlers
const handleLogin: ResponseResolver = async (req, res, ctx: RestContext) => {
  const { email, password } = await req.json();
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res(
      ctx.status(401),
      ctx.json({ message: 'Credenciais inválidas' })
    );
  }

  return res(
    ctx.status(200),
    ctx.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: 'mock-token',
    })
  );
};

const handleRegister: ResponseResolver = async (req, res, ctx: RestContext) => {
  const { name, email, password, role } = await req.json();
  const newUser: TestUser = {
    id: mockUsers.length + 1,
    name,
    email,
    password,
    role: role as UserRole,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);

  return res(
    ctx.status(201),
    ctx.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token: 'mock-token',
    })
  );
};

const handleGetTechnicians: ResponseResolver = async (req, res, ctx: RestContext) => {
  const techniciansWithDetails: TechnicianWithDetails[] = mockTechnicians.map(tech => ({
    ...tech,
    user: mockUsers.find(u => u.id === tech.userId)!,
    solicitations: mockSolicitations
      .filter(s => s.technicianId === tech.id)
      .map(s => ({
        id: s.id,
        title: s.title,
        status: s.status,
      })),
  }));

  return res(
    ctx.status(200),
    ctx.json(techniciansWithDetails)
  );
};

const handleGetTechnician: ResponseResolver = async (req: MockedRequestWithParams, res, ctx: RestContext) => {
  const { id } = req.params;
  const technician = mockTechnicians.find(t => t.id === Number(id));
  
  if (!technician) {
    return res(
      ctx.status(404),
      ctx.json({ message: 'Técnico não encontrado' })
    );
  }

  const technicianWithDetails: TechnicianWithDetails = {
    ...technician,
    user: mockUsers.find(u => u.id === technician.userId)!,
    solicitations: mockSolicitations
      .filter(s => s.technicianId === technician.id)
      .map(s => ({
        id: s.id,
        title: s.title,
        status: s.status,
      })),
  };

  return res(
    ctx.status(200),
    ctx.json(technicianWithDetails)
  );
};

const handleCreateTechnician: ResponseResolver = async (req, res, ctx: RestContext) => {
  const body = await req.json();
  const newTechnician: TestTechnician = {
    id: mockTechnicians.length + 1,
    ...body,
    status: 'available' as TechnicianStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockTechnicians.push(newTechnician);

  const technicianWithDetails: TechnicianWithDetails = {
    ...newTechnician,
    user: mockUsers.find(u => u.id === newTechnician.userId)!,
    solicitations: [],
  };

  return res(
    ctx.status(201),
    ctx.json(technicianWithDetails)
  );
};

const handleUpdateTechnician: ResponseResolver = async (req: MockedRequestWithParams, res, ctx: RestContext) => {
  const { id } = req.params;
  const body = await req.json();
  const index = mockTechnicians.findIndex(t => t.id === Number(id));
  
  if (index === -1) {
    return res(
      ctx.status(404),
      ctx.json({ message: 'Técnico não encontrado' })
    );
  }

  mockTechnicians[index] = {
    ...mockTechnicians[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  const technicianWithDetails: TechnicianWithDetails = {
    ...mockTechnicians[index],
    user: mockUsers.find(u => u.id === mockTechnicians[index].userId)!,
    solicitations: mockSolicitations
      .filter(s => s.technicianId === mockTechnicians[index].id)
      .map(s => ({
        id: s.id,
        title: s.title,
        status: s.status,
      })),
  };

  return res(
    ctx.status(200),
    ctx.json(technicianWithDetails)
  );
};

const handleDeleteTechnician: ResponseResolver = async (req: MockedRequestWithParams, res, ctx: RestContext) => {
  const { id } = req.params;
  const index = mockTechnicians.findIndex(t => t.id === Number(id));
  
  if (index === -1) {
    return res(
      ctx.status(404),
      ctx.json({ message: 'Técnico não encontrado' })
    );
  }

  mockTechnicians.splice(index, 1);
  return res(ctx.status(204));
};

const handleGetSolicitations: ResponseResolver = async (req, res, ctx: RestContext) => {
  const solicitationsWithDetails: SolicitationWithDetails[] = mockSolicitations.map(sol => ({
    ...sol,
    user: mockUsers.find(u => u.id === sol.userId)!,
    technician: sol.technicianId ? mockTechnicians.find(t => t.id === sol.technicianId) : undefined,
    comments: mockComments.filter(c => c.solicitationId === sol.id),
    attachments: mockAttachments.filter(a => a.solicitationId === sol.id),
  }));

  return res(
    ctx.status(200),
    ctx.json(solicitationsWithDetails)
  );
};

const handleGetSolicitation: ResponseResolver = async (req: MockedRequestWithParams, res, ctx: RestContext) => {
  const { id } = req.params;
  const solicitation = mockSolicitations.find(s => s.id === Number(id));
  
  if (!solicitation) {
    return res(
      ctx.status(404),
      ctx.json({ message: 'Solicitação não encontrada' })
    );
  }

  const solicitationWithDetails: SolicitationWithDetails = {
    ...solicitation,
    user: mockUsers.find(u => u.id === solicitation.userId)!,
    technician: solicitation.technicianId ? mockTechnicians.find(t => t.id === solicitation.technicianId) : undefined,
    comments: mockComments.filter(c => c.solicitationId === solicitation.id),
    attachments: mockAttachments.filter(a => a.solicitationId === solicitation.id),
  };

  return res(
    ctx.status(200),
    ctx.json(solicitationWithDetails)
  );
};

const handleCreateSolicitation: ResponseResolver = async (req, res, ctx: RestContext) => {
  const body = await req.json();
  const newSolicitation: TestSolicitation = {
    id: mockSolicitations.length + 1,
    ...body,
    status: 'pending' as SolicitationStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockSolicitations.push(newSolicitation);

  const solicitationWithDetails: SolicitationWithDetails = {
    ...newSolicitation,
    user: mockUsers.find(u => u.id === newSolicitation.userId)!,
    technician: newSolicitation.technicianId ? mockTechnicians.find(t => t.id === newSolicitation.technicianId) : undefined,
    comments: [],
    attachments: [],
  };

  return res(
    ctx.status(201),
    ctx.json(solicitationWithDetails)
  );
};

const handleUpdateSolicitation: ResponseResolver = async (req: MockedRequestWithParams, res, ctx: RestContext) => {
  const { id } = req.params;
  const body = await req.json();
  const index = mockSolicitations.findIndex(s => s.id === Number(id));
  
  if (index === -1) {
    return res(
      ctx.status(404),
      ctx.json({ message: 'Solicitação não encontrada' })
    );
  }

  mockSolicitations[index] = {
    ...mockSolicitations[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  const solicitationWithDetails: SolicitationWithDetails = {
    ...mockSolicitations[index],
    user: mockUsers.find(u => u.id === mockSolicitations[index].userId)!,
    technician: mockSolicitations[index].technicianId ? mockTechnicians.find(t => t.id === mockSolicitations[index].technicianId) : undefined,
    comments: mockComments.filter(c => c.solicitationId === mockSolicitations[index].id),
    attachments: mockAttachments.filter(a => a.solicitationId === mockSolicitations[index].id),
  };

  return res(
    ctx.status(200),
    ctx.json(solicitationWithDetails)
  );
};

const handleUpdateSolicitationStatus: ResponseResolver = async (req: MockedRequestWithParams, res, ctx: RestContext) => {
  const { id } = req.params;
  const { status } = await req.json() as RequestBody;
  const index = mockSolicitations.findIndex(s => s.id === Number(id));
  
  if (index === -1) {
    return res(
      ctx.status(404),
      ctx.json({ message: 'Solicitação não encontrada' })
    );
  }

  mockSolicitations[index] = {
    ...mockSolicitations[index],
    status: status as SolicitationStatus,
    updatedAt: new Date().toISOString(),
  };

  const solicitationWithDetails: SolicitationWithDetails = {
    ...mockSolicitations[index],
    user: mockUsers.find(u => u.id === mockSolicitations[index].userId)!,
    technician: mockSolicitations[index].technicianId ? mockTechnicians.find(t => t.id === mockSolicitations[index].technicianId) : undefined,
    comments: mockComments.filter(c => c.solicitationId === mockSolicitations[index].id),
    attachments: mockAttachments.filter(a => a.solicitationId === mockSolicitations[index].id),
  };

  return res(
    ctx.status(200),
    ctx.json(solicitationWithDetails)
  );
};

const handleDeleteSolicitation: ResponseResolver = async (req: MockedRequestWithParams, res, ctx: RestContext) => {
  const { id } = req.params;
  const index = mockSolicitations.findIndex(s => s.id === Number(id));
  
  if (index === -1) {
    return res(
      ctx.status(404),
      ctx.json({ message: 'Solicitação não encontrada' })
    );
  }

  mockSolicitations.splice(index, 1);
  return res(ctx.status(204));
};

const handleCreateComment: ResponseResolver = async (req, res, ctx: RestContext) => {
  const body = await req.json() as CommentRequestBody;
  const newComment: CommentWithUser = {
    id: mockComments.length + 1,
    content: body.content,
    createdAt: new Date().toISOString(),
    userId: body.userId,
    solicitationId: body.solicitationId,
    user: mockUsers.find(u => u.id === body.userId)!,
  };
  mockComments.push(newComment);

  return res(
    ctx.status(201),
    ctx.json(newComment)
  );
};

const handleCreateAttachment: ResponseResolver = async (req, res, ctx: RestContext) => {
  const body = await req.json() as AttachmentRequestBody;
  const newAttachment: AttachmentWithDetails = {
    id: mockAttachments.length + 1,
    filename: body.file.name,
    url: 'http://example.com/' + body.file.name,
    createdAt: new Date().toISOString(),
    solicitationId: body.solicitationId,
    userId: body.userId,
    user: mockUsers.find(u => u.id === body.userId)!,
  };
  mockAttachments.push(newAttachment);

  return res(
    ctx.status(201),
    ctx.json(newAttachment)
  );
};

export const handlers: RequestHandler[] = [
  // Auth
  rest.post(`${baseUrl}${API_ENDPOINTS.AUTH}/login`, handleLogin),
  rest.post(`${baseUrl}${API_ENDPOINTS.AUTH}/register`, handleRegister),

  // Technicians
  rest.get(`${baseUrl}${API_ENDPOINTS.TECHNICIANS}`, handleGetTechnicians),
  rest.get(`${baseUrl}${API_ENDPOINTS.TECHNICIANS}/:id`, handleGetTechnician),
  rest.post(`${baseUrl}${API_ENDPOINTS.TECHNICIANS}`, handleCreateTechnician),
  rest.put(`${baseUrl}${API_ENDPOINTS.TECHNICIANS}/:id`, handleUpdateTechnician),
  rest.delete(`${baseUrl}${API_ENDPOINTS.TECHNICIANS}/:id`, handleDeleteTechnician),

  // Solicitations
  rest.get(`${baseUrl}${API_ENDPOINTS.SOLICITATIONS}`, handleGetSolicitations),
  rest.get(`${baseUrl}${API_ENDPOINTS.SOLICITATIONS}/:id`, handleGetSolicitation),
  rest.post(`${baseUrl}${API_ENDPOINTS.SOLICITATIONS}`, handleCreateSolicitation),
  rest.put(`${baseUrl}${API_ENDPOINTS.SOLICITATIONS}/:id`, handleUpdateSolicitation),
  rest.patch(`${baseUrl}${API_ENDPOINTS.SOLICITATIONS}/:id/status`, handleUpdateSolicitationStatus),
  rest.delete(`${baseUrl}${API_ENDPOINTS.SOLICITATIONS}/:id`, handleDeleteSolicitation),

  // Comments
  rest.post(`${baseUrl}${API_ENDPOINTS.COMMENTS}`, handleCreateComment),

  // Attachments
  rest.post(`${baseUrl}${API_ENDPOINTS.ATTACHMENTS}`, handleCreateAttachment),
];