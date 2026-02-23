/**
 * Post-processing script to update the OpenAPI index page with correct links
 * after the OpenAPI docs have been generated.
 */

import { updateOpenApiIndex, renameInfoFilesToIndex } from '../src/openapi/preprocessing';

try {
    console.log('🔄 Running post-generation OpenAPI processing...');
    renameInfoFilesToIndex();
    updateOpenApiIndex();
    console.log('✅ OpenAPI post-processing complete');
} catch (error) {
    console.error('❌ OpenAPI post-processing failed:', error);
    process.exit(1);
}
