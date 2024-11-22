import * as React from 'react';
import { 
    Divider,
    Input
} from 'semantic-ui-react';
import './profile.scss';

export default function Profile(): React.JSX.Element {
    
    React.useEffect(() => {
        
    }, []);

    return (
        <div className="page product">
            <div className="page-inner">
                <div className="manage-page">
                    <p className="page-title">Profile</p>
                    <Divider />

                    <div className='d-flex flex-direction-column address-wrapper'>
                        <p className="page-title mb-3">Shipping Address</p>
                        <Input className='mb-3' placeholder="Street Address"/>
                        <Input className='mb-3' placeholder="City"/>
                        <Input className='mb-3' placeholder="State"/>
                        <Input className='mb-3' placeholder="Zip"/>
                        <Input className='mb-3' placeholder="Country"/>
                    </div>

                    <div className='d-flex flex-direction-column address-wrapper'>
                        <p className="page-title mb-3">Billing Address</p>
                        <Input className='mb-3' placeholder="Street Address"/>
                        <Input className='mb-3' placeholder="City"/>
                        <Input className='mb-3' placeholder="State"/>
                        <Input className='mb-3' placeholder="Zip"/>
                        <Input className='mb-3' placeholder="Country"/>
                    </div>

                </div>
            </div>
        </div>
    );
}
