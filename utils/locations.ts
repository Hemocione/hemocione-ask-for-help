// utils/locations.ts

const prepositions = [
  "de", "da", "do", "das", "dos", "em", "no", "na", "nos", "nas",
  "a", "ao", "à", "às", "e", "ou",
];

const formatName = (name: string) =>
  name
    .replace(/\s*\(.*?\)/g, "")
    .toLowerCase()
    .split(" ")
    .map((word, i) =>
      prepositions.includes(word) && i !== 0
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

const getEstadosListWithLabel = () => [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

const fetchFrom = async <T = any>(
  path: string,
  baseURL: string,
  params?: Record<string, any>
): Promise<T> => {
  const { data, error } = await useFetch<T>(path, { baseURL, params });
  if (error.value) throw error.value;
  return data.value as T;
};

const getCidadesFromEstado = async (estado: string): Promise<string[]> => {
  try {
    const data = await fetchFrom<{ nome: string }[]>(
      `/ibge/municipios/v1/${estado}`,
      "https://brasilapi.com.br/api",
      { providers: "dados-abertos-br,gov,wikipedia" }
    );
    return data.map((c) => formatName(c.nome));
  } catch {
    return [];
  }
};

interface CepData {
  cep?: string;
  neighborhood?: string;
  street?: string;
  city?: string;
  state?: string;
}

const parseViaCep = (data: any): CepData => ({
  cep: data.cep,
  neighborhood: data.bairro,
  street: data.logradouro,
  city: data.localidade,
  state: data.uf,
});

const getCepData = async (cep: string): Promise<CepData> => {
  const fetchBrasilApi = async () =>
    await fetchFrom<CepData>(`/cep/v2/${cep}`, "https://brasilapi.com.br/api").catch(() =>
      fetchFrom<CepData>(`/cep/v1/${cep}`, "https://brasilapi.com.br/api")
    );

  const fetchViaCep = async () =>
    parseViaCep(await fetchFrom<any>(`/${cep}/json`, "https://viacep.com.br/ws"));

  return await Promise.any([fetchBrasilApi(), fetchViaCep()]);
};

export { getCepData, getEstadosListWithLabel, getCidadesFromEstado };
