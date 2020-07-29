
# Ab test docs

  Create ab inside angular 

## Create module with config and import it

```js
export const abTestsOptions: AbTestOptions[] = [
    {
        versions  : [
            {name: 'old', percent: 50},
            {name: 'new', percent: 50}
        ],
        cookieName: 'ab-test-default'
    },
];

@NgModule({
    imports: [
        AbTestsModule.forRoot(abTestsOptions),
    ],
})
export class AbModule {
}
```

## Init this versions in html with *abTest decorator.

  You can set to ab test separate html or components

```html
   <ng-container *abTest="{name:'ab-test-default',version:'old'}">
        First ab test content
   </ng-container>
   <ng-container *abTest="{name:'ab-test-default',version:'old'}">
        <app-test></app-test>
   </ng-container>
```