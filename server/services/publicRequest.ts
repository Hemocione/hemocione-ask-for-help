// Allowlists das respostas sem login (ou só com o secret de integração).
// Monte sempre um objeto novo campo a campo: nunca use spread de Request ou
// Assisted aqui, senão uma coluna nova (ou o CPF) volta a sair na API pública.

type AssistedLike = {
  name: string;
  blood_type: string;
  photo_url: string | null;
};

type RequestLike = {
  id: number;
  local_name: string;
  address: string;
  assisted: AssistedLike;
  distanceKm?: number;
};

type OndeDoarRequestLike = {
  id: number;
  local_name: string;
  address: string;
  city: string;
  state: string;
  local_latitude: number | null;
  local_longitude: number | null;
  active_campagin: boolean;
  review_status: string | null;
  created_at: Date;
  updated_at: Date;
};

export type PublicRequest<B extends string = string> = {
  id: number;
  local_name: string;
  address: string;
  distanceKm?: number;
  assisted: {
    name: string;
    blood_type: B;
    photo_url: string | null;
  };
};

// Só o que as páginas públicas mostram (lista, /description/:id, imagem de
// compartilhamento): o pedido de doação é público por desenho.
export function toPublicRequest<B extends string>(
  request: RequestLike & { assisted: { blood_type: B } },
): PublicRequest<B> {
  const result: PublicRequest<B> = {
    id: request.id,
    local_name: request.local_name,
    address: request.address,
    assisted: {
      name: request.assisted.name,
      blood_type: request.assisted.blood_type,
      photo_url: request.assisted.photo_url,
    },
  };

  if (request.distanceKm !== undefined) {
    result.distanceKm = request.distanceKm;
  }

  return result;
}

export type OndeDoarRequest = OndeDoarRequestLike;

// Só o que o sync do ondedoar lê: o local de doação e o estado do pedido.
// Nada do paciente nem de quem pediu.
export function toOndeDoarRequest(request: OndeDoarRequestLike): OndeDoarRequest {
  return {
    id: request.id,
    local_name: request.local_name,
    address: request.address,
    city: request.city,
    state: request.state,
    local_latitude: request.local_latitude,
    local_longitude: request.local_longitude,
    active_campagin: request.active_campagin,
    review_status: request.review_status,
    created_at: request.created_at,
    updated_at: request.updated_at,
  };
}
