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
  addDynamicComponent(modalText: string, modelContent?:any) {
      const factory = this.factoryResolver.resolveComponentFactory(ModalComponent);
      const component = factory.create(this.rootViewContainer.parentInjector);
      component.instance.modalText = modalText;
      component.instance.modelContent = modelContent;
      component.instance.closeModal.subscribe(() => this.removeDynamicComponent(component));
      this.rootViewContainer.insert(component.hostView);
  }

  addConfirmationDialog(message: string) {
    this.addDynamicComponent('confirmation', { message });
  }

  removeDynamicComponent(component:any) {
      component.destroy();
  }
}
