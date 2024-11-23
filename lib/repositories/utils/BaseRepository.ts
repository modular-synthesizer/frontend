export class BaseRepository {

    private resource: string = '';

    BASE_URI = '/proxy';
  
    public constructor(resource: string = '') {
      this.resource = resource;
    }

    protected uri(appended: string = ''): string {
      const resource: string[] = this.resource === '' ? [] : [ this.resource ];
      const ending: string[] = appended === '' ? [] : [ appended ];
      return [ this.BASE_URI, ...resource, ...ending ].join('/');
    }
}