export class BaseRepository {

    public readonly resource: string = '';

    public readonly BASE_URI = '/proxy';
  
    public constructor(resource: string = '') {
      this.resource = resource;
    }

    public uri(appended: string = ''): string {
      const resource: string[] = this.resource === '' ? [] : [ this.resource ];
      const ending: string[] = appended === '' ? [] : [ appended ];
      return [ this.BASE_URI, ...resource, ...ending ].join('/');
    }
}