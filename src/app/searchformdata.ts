export class SearchFormData{
    constructor(
    public keyword: string,
    public category: string,
    public locationcasual: string,
    public distance?: number
    ) {  }
}