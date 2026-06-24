export interface IInterfaz {
  id: string
  fechaInicio: string | null
  tipo: number | null
  nombre: string | null
  fechaTermino: string | null
  cantActualiza: number | null
  estado: string | null
  observacion: string | null
}

export interface ISapBanco {
  id: number
  BankCountry: string
  BankKey: string
  BankName: string
  Region: string
  City: string
  SwiftCode: string
  BankCountryName: string
}

export interface ISapCentro {
  id: number
  Plant: string
  PlantName: string
  SalesOrganization: string
  Language: string
  IsMarkedForArchiving: boolean
}

export interface ISapCentroCosto {
  id: number
  ControllingArea: string
  CostCenter: string
  CostCenterCategory: string
  IsBlocked: boolean
  CompanyCode: string
  Department: string
  Country: string
}

export interface ISapSociedad {
  id: number
  CompanyCode: string
  CompanyCodeName: string
  CityName: string
  Country: string
  Currency: string
  Language: string
  ControllingArea: string
}

export interface ISapRegion {
  id: number
  Codigo: string
  Descripcion: string
}