// Package examples contains compile-only type-assertion tests for the OpenTDF Go SDK.
// These functions are never run; they exist solely so that `go build ./...` will fail
// if a documented method signature drifts from the actual SDK.
package examples

import (
	"bytes"
	"context"
	"io"

	"github.com/opentdf/platform/lib/ocrypto"
	"github.com/opentdf/platform/sdk"
)

// verifyCreateTDF verifies: (s SDK) CreateTDF(io.Writer, io.ReadSeeker, ...TDFOption) (*TDFObject, error)
func verifyCreateTDF(client sdk.SDK, w io.Writer, r io.ReadSeeker) {
	var obj *sdk.TDFObject
	var err error
	obj, err = client.CreateTDF(w, r)
	_, _ = obj, err
}

// verifyLoadTDF verifies: (s SDK) LoadTDF(io.ReadSeeker, ...TDFReaderOption) (*Reader, error)
func verifyLoadTDF(client sdk.SDK, rs io.ReadSeeker) {
	var r *sdk.Reader
	var err error
	r, err = client.LoadTDF(rs)
	_, _ = r, err
}

// verifyIsValidTdf verifies: IsValidTdf(io.ReadSeeker) (bool, error)
func verifyIsValidTdf(rs io.ReadSeeker) {
	var ok bool
	var err error
	ok, err = sdk.IsValidTdf(rs)
	_, _ = ok, err
}

// verifyBulkDecrypt verifies: (s SDK) BulkDecrypt(ctx, ...BulkDecryptOption) error
func verifyBulkDecrypt(client sdk.SDK, ctx context.Context) {
	var err error
	err = client.BulkDecrypt(ctx)
	_ = err
}

// verifyPrepareBulkDecrypt verifies: (s SDK) PrepareBulkDecrypt(ctx, ...) (*BulkDecryptPrepared, error)
func verifyPrepareBulkDecrypt(client sdk.SDK, ctx context.Context) {
	var p *sdk.BulkDecryptPrepared
	var err error
	p, err = client.PrepareBulkDecrypt(ctx)
	_, _ = p, err
}

// verifyReaderMethods verifies Reader method signatures
func verifyReaderMethods(r *sdk.Reader) {
	var w bytes.Buffer

	var n int64
	var err error
	n, err = r.WriteTo(&w)
	_, _ = n, err

	var meta []byte
	meta, err = r.UnencryptedMetadata()
	_, _ = meta, err

	var pol sdk.PolicyObject
	pol, err = r.Policy()
	_, _ = pol, err

	var attrs []string
	attrs, err = r.DataAttributes()
	_, _ = attrs, err

	var m sdk.Manifest
	m = r.Manifest()
	_ = m
}

// verifyEncryptOptions verifies encrypt option function signatures
func verifyEncryptOptions() {
	_ = sdk.WithDataAttributes("https://example.com/attr/clearance/value/executive")
	_ = sdk.WithKasInformation(sdk.KASInfo{URL: "https://kas.example.com"})
	_ = sdk.WithAutoconfigure(true)
	_ = sdk.WithMetaData("metadata string")
	_ = sdk.WithMimeType("text/plain")
	_ = sdk.WithSegmentSize(int64(1024 * 1024))
	_ = sdk.WithAssertions(sdk.AssertionConfig{})
	_ = sdk.WithWrappingKeyAlg(ocrypto.EC256Key)
}

// verifyDecryptOptions verifies decrypt option function signatures
func verifyDecryptOptions() {
	_ = sdk.WithKasAllowlist([]string{"https://kas.example.com"})
	_ = sdk.WithIgnoreAllowlist(true)
	_ = sdk.WithAssertionVerificationKeys(sdk.AssertionVerificationKeys{})
	_ = sdk.WithDisableAssertionVerification(true)
	_ = sdk.WithSessionKeyType(ocrypto.EC256Key)
	_ = sdk.WithTDFFulfillableObligationFQNs([]string{"https://example.com/obl/audit/value/log"})
	_ = sdk.WithMaxManifestSize(int64(1024 * 1024))
}
