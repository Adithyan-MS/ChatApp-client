import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { ModalComponent } from '../pages/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private rootViewContainer: ViewContainerRef;

  constructor(private factoryResolver: ComponentFactoryResolver) {
      this.factoryResolver = factoryResolver;
  }
  setRootViewContainerRef(viewContainerRef:ViewContainerRef) {
      this.rootViewContainer = viewContainerRef;
  }

  addDynamicComponent(modalText: string,modalTitle?:any, modelContent?:any):Promise<any> {
    return new Promise((resolve, reject) => {
      const factory = this.factoryResolver.resolveComponentFactory(ModalComponent);
      const component = factory.create(this.rootViewContainer.parentInjector);

      component.instance.modalText = modalText;
      component.instance.modelContent = modelContent;
      component.instance.modalTitle = modalTitle;

      const subscription = component.instance.closeModal.subscribe((value) => {
        this.removeDynamicComponent(component);
        resolve(value);
      });

      this.rootViewContainer.insert(component.hostView);

      component.onDestroy(() => {
        subscription.unsubscribe();
        this.removeDynamicComponent(component);
      });
    });
  }

  removeDynamicComponent(component:any) {
      component.destroy();
  }
}
